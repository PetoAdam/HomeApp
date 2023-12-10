import subprocess
import time
import configparser
from bluetooth_operations import *

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
        print(f"Pairing initiated with {selected_device['name']} ({device_address}).")
        pair_device(device_address)
        
        # Add a delay to allow time for the device to finish pairing
        time.sleep(5)
        
        print(f"Connection initiated with {selected_device['name']} ({device_address}).")
        connect_device(device_address)
        save_last_connected_device(device_address)
    else:
        print("Invalid choice. No pairing initiated.")
else:
    print("No pairable devices found.")
