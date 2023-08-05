import subprocess

def list_connected_speakers():
    output = subprocess.check_output(['bluetoothctl', 'devices'], universal_newlines=True)
    lines = output.split('\n')
    speakers = []
    for line in lines:
        if 'Device' in line:
            device_info = line.split('Device ')[1].split(' ')
            device_address = device_info[0]
            device_name = ' '.join(device_info[1:])
            device_type = subprocess.check_output(['bluetoothctl', 'info', device_address], universal_newlines=True)
            if("Audio Sink" in device_type and "Connected: yes" in device_type):
                speakers.append({'address': device_address, 'name': device_name})
    return speakers

connected_speakers = list_connected_speakers()
if connected_speakers:
    print("Connected Bluetooth Speakers:")
    for speaker in connected_speakers:
        print("Name:", speaker['name'])
        print("Address:", speaker['address'])
        print()
else:
    print("No Bluetooth speakers connected.")
