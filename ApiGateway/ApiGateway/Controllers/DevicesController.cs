using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiGateway.Models;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Grpc;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/devices")]
    public class DevicesController : ControllerBase
    {
        private readonly Dal.ApplicationDbContext _context;
        private readonly GrpcChannel _channel;
        private readonly Grpc.DeviceService.DeviceServiceClient _client;

        public DevicesController(Dal.ApplicationDbContext dbContext)
        {
            this._context = dbContext;
            this._channel = GrpcChannel.ForAddress("http://localhost:5043");
            this._client = new Grpc.DeviceService.DeviceServiceClient(this._channel);
        }

        [HttpGet]
        public async Task<ActionResult<Models.Device[]>> List()
        {
            var response = await _client.ListAsync(new Grpc.ListDevicesRequest());

            List<Models.Device> devices = new List<Models.Device>();
            foreach (var device in response.Devices)
            {
                var location = device.Location;
                devices.Add(new Models.Device(device.Id, device.Name, device.Zigbee2MqttId, new Models.Location(location.Id, location.X, location.Y, location.Description)));
            }

            return devices.ToArray();
        }

        [HttpGet("{locationId}")]
        public async Task<ActionResult<Models.Device>> GetByLocation(int locationId)
        {
            var response = await _client.GetByLocationAsync(new Grpc.GetByLocationRequest { LocationId = locationId });
            var device = response.Device;
            var location = device.Location;
            return new Models.Device(device.Id, device.Name, device.Zigbee2MqttId, new Models.Location(location.Id, location.X, location.Y, location.Description));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateDevice([FromBody] NewDevice newDevice)
        {
            // TODO: Call zigbee2mqtt to pair new device, wait until device is added, then continue
            // TODO: Change NewDevice to allow setting more parameters then the current ones, after zigbee2mqtt is set up.
            var request = new Grpc.CreateDeviceRequest
            {
                NewDevice = new Grpc.NewDevice
                {
                    Name = newDevice.Name,
                    LocationId = newDevice.LocationId
                }
            };
            var response = await _client.CreateDeviceAsync(request);
            var device = response.Device;
            var location = device.Location;
            var modelDevice = new Models.Device(device.Id, device.Name, device.Zigbee2MqttId, new Models.Location(location.Id, location.X, location.Y, location.Description));

            return CreatedAtAction(nameof(GetByLocation), modelDevice);
        }
    }
}
