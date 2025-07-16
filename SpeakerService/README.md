# Speaker Service

## About

The Speaker Service allows you to connect and manage Bluetooth speakers through a gRPC interface. It provides functionalities to list pairable devices, connect to a selected device, disconnect from a device, and list currently connected speakers.

## Requirements

- Python 3.9 or higher
- Required Python packages:
  - grpcio
  - grpcio-tools

You can install the required packages using pip:

```bash
pip install -r requirements.txt
```

## Getting Started

1. **Clone the repository** or download the project files to your local machine.

2. **Navigate to the SpeakerService directory**:

   ```bash
   cd /path/to/HomeApp/SpeakerService
   ```

3. **Compile the protobuf file** to generate the necessary Python files:

   ```bash
   protoc --python_out=./protos speaker.proto
   python3 -m grpc_tools.protoc -I./protos --python_out=./protos --pyi_out=./protos --grpc_python_out=./protos speaker.proto
   ```

4. **Run the Speaker Service**:

   You can start the service directly using Python:

   ```bash
   python3 speaker_service.py
   ```

## Usage

- **List Pairable Devices**: Call the `ListPairableDevices` method to get a list of Bluetooth devices available for pairing.
- **Connect to a Device**: Use the `ConnectDevice` method with the device's address to connect to it.
- **Disconnect from a Device**: Call the `DisconnectDevice` method with the device's address to disconnect.
- **List Connected Speakers**: Use the `ListConnectedSpeakers` method to see all currently connected Bluetooth speakers.

## Configuration

The service uses a configuration file (`config.ini`) to store the last connected device's address. Ensure this file is present in the SpeakerService directory before running the service for the first time.