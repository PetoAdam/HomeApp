import subprocess
import time
import configparser

def connect_to_last_device():
    config = configparser.ConfigParser()
    config.read('/home/ubuntu/Projects/HomeApp/SpeakerService/config.ini')

    if 'Bluetooth' in config and 'last_connected_device' in config['Bluetooth']:
        last_device_address = config['Bluetooth']['last_connected_device']
        print(f"Auto-connecting to the last connected device with MAC address: {last_device_address}")
        subprocess.call(['bluetoothctl', 'connect', last_device_address])
    else:
        print("No last connected device found in the config file. Please run the main script first to pair and connect a device.")

if __name__ == "__main__":
    connect_to_last_device()
