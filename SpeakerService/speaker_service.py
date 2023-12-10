import subprocess
from time import sleep
import grpc
from concurrent import futures
import bluetooth_operations  # Import your Bluetooth operations module
import protos.speaker_pb2 as speaker_pb2
from protos.speaker_pb2_grpc import SpeakerServiceServicer, add_SpeakerServiceServicer_to_server
from auto_connect_speaker import connect_to_last_device

port = 5046

class SpeakerServiceServer(SpeakerServiceServicer):

    def ListPairableDevices(self, request, context):
        print("Listing pairable bluetooth devices...")
        devices = bluetooth_operations.list_pairable_devices()
        print(devices)
        response = speaker_pb2.ListPairableDevicesResponse(devices=devices)
        return response

    def ConnectDevice(self, request, context):
        device_address = request.device_address
        print("Connecting to device: ", device_address)
        bluetooth_operations.pair_device(device_address)
        connect_success = bluetooth_operations.connect_device(device_address)
        if(connect_success):
            print("Successfully connected to device ", device_address)
            self.update_asoundrc(device_address)
            bluetooth_operations.save_last_connected_device(device_address)
            self.restart_spotifyd()
        else:
            print("Connection not successful to device ", device_address)
        response = speaker_pb2.ConnectDeviceResponse(success=connect_success)
        return response

    def DisconnectDevice(self, request, context):
        device_address = request.device_address
        print("Disconnecting from device: ", device_address)
        disconnect_success = bluetooth_operations.disconnect_device(device_address)
        if(disconnect_success):
            print("Successfully disconnected from device ", device_address)
        else:
            print("Disconnect not successful from device ", device_address)
        response = speaker_pb2.DisconnectDeviceResponse(success=disconnect_success)
        return response

    def ListConnectedSpeakers(self, request, context):
        print("Listing connected devices...")
        speakers = bluetooth_operations.list_connected_speakers()
        print(speakers)
        response = speaker_pb2.ListConnectedSpeakersResponse(speakers=speakers)
        return response
    
    def update_asoundrc(self, device_address):
        # Construct the new pcm.!default configuration with the provided device_address
        new_asoundrc_content = f"""
pcm.!default {{
    type plug
    slave.pcm {{
        type bluealsa
        device "{device_address}"
        profile "a2dp"
    }}
}}
"""

        # Write the new configuration to the .asoundrc file
        try:
            with open('/home/ubuntu/.asoundrc', 'w') as file:
                file.write(new_asoundrc_content)
        except Exception as e:
            print(f"Error updating .asoundrc: {str(e)}")
            return False
        subprocess.call(['alsactl', 'kill', 'rescan'])
        
    def restart_spotifyd(self):
        subprocess.call(['sudo', 'systemctl', 'restart', 'spotifyd.service'])
        sleep(1)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_SpeakerServiceServicer_to_server(SpeakerServiceServer(), server)
    server.add_insecure_port('[::]:' + str(port))
    server.start()
    print("SpeakerService started on port: ", port)
    server.wait_for_termination()

if __name__ == '__main__':
    print("Starting SpeakerService...")
    connect_to_last_device()
    serve()
