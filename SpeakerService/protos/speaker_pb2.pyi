from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ListPairableDevicesRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class ListPairableDevicesResponse(_message.Message):
    __slots__ = ["devices"]
    DEVICES_FIELD_NUMBER: _ClassVar[int]
    devices: _containers.RepeatedCompositeFieldContainer[DeviceInfo]
    def __init__(self, devices: _Optional[_Iterable[_Union[DeviceInfo, _Mapping]]] = ...) -> None: ...

class ConnectDeviceRequest(_message.Message):
    __slots__ = ["device_address"]
    DEVICE_ADDRESS_FIELD_NUMBER: _ClassVar[int]
    device_address: str
    def __init__(self, device_address: _Optional[str] = ...) -> None: ...

class ConnectDeviceResponse(_message.Message):
    __slots__ = ["success"]
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    success: bool
    def __init__(self, success: bool = ...) -> None: ...

class DisconnectDeviceRequest(_message.Message):
    __slots__ = ["device_address"]
    DEVICE_ADDRESS_FIELD_NUMBER: _ClassVar[int]
    device_address: str
    def __init__(self, device_address: _Optional[str] = ...) -> None: ...

class DisconnectDeviceResponse(_message.Message):
    __slots__ = ["success"]
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    success: bool
    def __init__(self, success: bool = ...) -> None: ...

class ListConnectedSpeakersRequest(_message.Message):
    __slots__ = []
    def __init__(self) -> None: ...

class ListConnectedSpeakersResponse(_message.Message):
    __slots__ = ["speakers"]
    SPEAKERS_FIELD_NUMBER: _ClassVar[int]
    speakers: _containers.RepeatedCompositeFieldContainer[DeviceInfo]
    def __init__(self, speakers: _Optional[_Iterable[_Union[DeviceInfo, _Mapping]]] = ...) -> None: ...

class DeviceInfo(_message.Message):
    __slots__ = ["name", "address", "type"]
    NAME_FIELD_NUMBER: _ClassVar[int]
    ADDRESS_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    name: str
    address: str
    type: str
    def __init__(self, name: _Optional[str] = ..., address: _Optional[str] = ..., type: _Optional[str] = ...) -> None: ...
