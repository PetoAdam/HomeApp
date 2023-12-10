import subprocess
import time
import configparser

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

def save_last_connected_device(device_address):
    config = configparser.ConfigParser()
    config.read('SpeakerService/config.ini')

    if 'Bluetooth' not in config:
        config['Bluetooth'] = {}
    
    config['Bluetooth']['last_connected_device'] = device_address

    with open('SpeakerService/config.ini', 'w') as configfile:
        config.write(configfile)


def list_pairable_devices():
    print("Finding nearby devices...")
    subprocess.call(['bluetoothctl', 'discoverable', 'on'], universal_newlines=True)
    subprocess.call(['bluetoothctl', 'pairable', 'on'], universal_newlines=True)
    scan_process = subprocess.Popen(['bluetoothctl', 'scan', 'on'], stdin=subprocess.PIPE, universal_newlines=True)
    time.sleep(10)
    output = subprocess.check_output(['bluetoothctl', 'devices'], universal_newlines=True)
    scan_process.terminate()
    print(output)
    lines = output.split('\n')
    devices = []
    for line in lines:
        if 'Device' in line:
            device_info = line.split('Device ')[1].split(' ')
            device_address = device_info[0]
            device_name = ' '.join(device_info[1:])
            device_type = subprocess.check_output(['bluetoothctl', 'info', device_address], universal_newlines=True)
            print(device_type)
            if("Audio Sink" in device_type or "audio-card" in device_type or "audio-headphones" in device_type):
                devices.append({'address': device_address, 'name': device_name, 'type': device_type})
    return devices

def pair_device(device_address):
    subprocess.call(['bluetoothctl', 'pair', device_address])

def connect_device(device_address):
    try:
        # Run the 'bluetoothctl' command and capture its output
        output = subprocess.check_output(['bluetoothctl', 'connect', device_address], universal_newlines=True)
        
        # Check if the output contains a success message
        if "Connection successful" in output:
            return True
        else:
            return False
    except subprocess.CalledProcessError as e:
        # If an error occurred while running the command, return False
        return False
    
def disconnect_device(device_address):
    try:
        # Run the 'bluetoothctl' command and capture its output
        output = subprocess.check_output(['bluetoothctl', 'disconnect', device_address], universal_newlines=True)
        
        # Check if the output contains a success message
        if "Successful disconnected" in output:
            return True
        else:
            return False
    except subprocess.CalledProcessError as e:
        # If an error occurred while running the command, return False
        return False
