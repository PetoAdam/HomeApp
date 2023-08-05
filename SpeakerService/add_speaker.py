import subprocess
import time
import configparser

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
            if("Audio Sink" in device_type):
                devices.append({'address': device_address, 'name': device_name, 'type': device_type})
    return devices

def pair_device(device_address):
    subprocess.call(['bluetoothctl', 'pair', device_address])

def connect_device(device_address):
    subprocess.call(['bluetoothctl', 'connect', device_address])

pairable_devices = list_pairable_devices()
if pairable_devices:
    print("Pairable Bluetooth Devices:")
    for index, device in enumerate(pairable_devices):
        print(f"{index+1}. Name: {device['name']}")
        print(f"   Address: {device['address']}")
        print(f"   Type: {device['type']}")
        print()

    choice = input("Enter the number of the device you want to pair: ")
    choice_index = int(choice) - 1

    if choice_index in range(len(pairable_devices)):
        selected_device = pairable_devices[choice_index]
        device_address = selected_device['address']
        pair_device(device_address)
        print(f"Pairing initiated with {selected_device['name']} ({device_address}).")
        
        # Add a delay to allow time for the device to finish pairing
        time.sleep(5)
        
        connect_device(device_address)
        save_last_connected_device(device_address)
        print(f"Connection initiated with {selected_device['name']} ({device_address}).")
    else:
        print("Invalid choice. No pairing initiated.")
else:
    print("No pairable devices found.")
