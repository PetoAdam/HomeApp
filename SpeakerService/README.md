# Speaker Service

## About

This service lets you connect your bluetooth speaker to your server.

## Requirements:

protobuf-compiler:
```apt install protobuf compiler```

grpc for python:
```pip install grpcio grpcio-tools```

## Getting started

Before starting the service make sure to compile the protobuf file from the protos folder to a python package via:
```
protoc --python_out=. speaker.proto
python3 -m grpc_tools.protoc -I. --python_out=. --pyi_out=. --grpc_python_out=. speaker.proto
```

- Note: It might be needed to replace the row ```import speaker_pb2 as speaker__pb2``` to ```import protos.speaker_pb2 as speaker__pb2``` in [speaker_pb2_grpc.py](protos/speaker_pb2_grpc.py)

After doing that, the service can be started via running the speaker_service.py file from the project's root directory:
```
python3 SpeakerService/speaker_service.py
```