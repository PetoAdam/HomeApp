import subprocess
from bluetooth_operations import list_connected_speakers

connected_speakers = list_connected_speakers()
if connected_speakers:
    print("Connected Bluetooth Speakers:")
    for speaker in connected_speakers:
        print("Name:", speaker['name'])
        print("Address:", speaker['address'])
        print()
else:
    print("No Bluetooth speakers connected.")
