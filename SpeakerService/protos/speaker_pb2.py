# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: speaker.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\rspeaker.proto\x12\x07HomeApp\"\x1c\n\x1aListPairableDevicesRequest\"C\n\x1bListPairableDevicesResponse\x12$\n\x07\x64\x65vices\x18\x01 \x03(\x0b\x32\x13.HomeApp.DeviceInfo\".\n\x14\x43onnectDeviceRequest\x12\x16\n\x0e\x64\x65vice_address\x18\x01 \x01(\t\"(\n\x15\x43onnectDeviceResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\"1\n\x17\x44isconnectDeviceRequest\x12\x16\n\x0e\x64\x65vice_address\x18\x01 \x01(\t\"+\n\x18\x44isconnectDeviceResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\"\x1e\n\x1cListConnectedSpeakersRequest\"F\n\x1dListConnectedSpeakersResponse\x12%\n\x08speakers\x18\x01 \x03(\x0b\x32\x13.HomeApp.DeviceInfo\"9\n\nDeviceInfo\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0f\n\x07\x61\x64\x64ress\x18\x02 \x01(\t\x12\x0c\n\x04type\x18\x03 \x01(\t2\x83\x03\n\x0eSpeakerService\x12`\n\x13ListPairableDevices\x12#.HomeApp.ListPairableDevicesRequest\x1a$.HomeApp.ListPairableDevicesResponse\x12N\n\rConnectDevice\x12\x1d.HomeApp.ConnectDeviceRequest\x1a\x1e.HomeApp.ConnectDeviceResponse\x12W\n\x10\x44isconnectDevice\x12 .HomeApp.DisconnectDeviceRequest\x1a!.HomeApp.DisconnectDeviceResponse\x12\x66\n\x15ListConnectedSpeakers\x12%.HomeApp.ListConnectedSpeakersRequest\x1a&.HomeApp.ListConnectedSpeakersResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'speaker_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_LISTPAIRABLEDEVICESREQUEST']._serialized_start=26
  _globals['_LISTPAIRABLEDEVICESREQUEST']._serialized_end=54
  _globals['_LISTPAIRABLEDEVICESRESPONSE']._serialized_start=56
  _globals['_LISTPAIRABLEDEVICESRESPONSE']._serialized_end=123
  _globals['_CONNECTDEVICEREQUEST']._serialized_start=125
  _globals['_CONNECTDEVICEREQUEST']._serialized_end=171
  _globals['_CONNECTDEVICERESPONSE']._serialized_start=173
  _globals['_CONNECTDEVICERESPONSE']._serialized_end=213
  _globals['_DISCONNECTDEVICEREQUEST']._serialized_start=215
  _globals['_DISCONNECTDEVICEREQUEST']._serialized_end=264
  _globals['_DISCONNECTDEVICERESPONSE']._serialized_start=266
  _globals['_DISCONNECTDEVICERESPONSE']._serialized_end=309
  _globals['_LISTCONNECTEDSPEAKERSREQUEST']._serialized_start=311
  _globals['_LISTCONNECTEDSPEAKERSREQUEST']._serialized_end=341
  _globals['_LISTCONNECTEDSPEAKERSRESPONSE']._serialized_start=343
  _globals['_LISTCONNECTEDSPEAKERSRESPONSE']._serialized_end=413
  _globals['_DEVICEINFO']._serialized_start=415
  _globals['_DEVICEINFO']._serialized_end=472
  _globals['_SPEAKERSERVICE']._serialized_start=475
  _globals['_SPEAKERSERVICE']._serialized_end=862
# @@protoc_insertion_point(module_scope)
