using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseService.Dal;
using DatabaseService.Models;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatabaseService.Services
{
    public class DevicesService : DeviceService.DeviceServiceBase
    {
        private readonly Dal.ApplicationDbContext _context;
        private readonly ILogger<DevicesService> _logger;

        public DevicesService(Dal.ApplicationDbContext dbContext, ILogger<DevicesService> logger)
        {
            this._context = dbContext;
            this._logger = logger;
        }

        public override async Task<ListDevicesResponse> List(ListDevicesRequest request, ServerCallContext context)
        {
            var dbDevices = await _context.Devices.ToListAsync();
            List<Device> devices = new List<Device>();
            foreach (var device in dbDevices)
            {
                var location = _context.Locations.FirstOrDefault(l => l.Id == device.LocationId);
                devices.Add(new Device
                {
                    Id = device.Id,
                    Name = device.Name,
                    Zigbee2MqttId = device.Zigbee2mqttId,
                    Ip = device.Ip,
                    Location = new Location
                    {
                        Id = location.Id,
                        X = location.X,
                        Y = location.Y,
                        Description = location.Description
                    }
                });
            }
            return new ListDevicesResponse { Devices = { devices } };
        }

        public override async Task<GetByLocationResponse> GetByLocation(GetByLocationRequest request, ServerCallContext context)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(d => d.LocationId == request.LocationId);
            var location = await _context.Locations.FirstOrDefaultAsync(l => l.Id == device.LocationId);
            return new GetByLocationResponse
            {
                Device = new Device
                {
                    Id = device.Id,
                    Name = device.Name,
                    Zigbee2MqttId = device.Zigbee2mqttId,
                    Ip = device.Ip,
                    Location = new Location
                    {
                        Id = location.Id,
                        X = location.X,
                        Y = location.Y,
                        Description = location.Description
                    }
                }
            };
        }

        public override async Task<CreateDeviceResponse> CreateDevice(CreateDeviceRequest request, ServerCallContext context)
        {
            // TODO: Call zigbee2mqtt to pair new device, wait until device is added, then continue
            // TODO: Change NewDevice to allow setting more parameters then the current ones, after mqtt/zigbee2mqtt is set up.

            // Create the device in the database
            var device = new Dal.Device
            {
                Name = request.NewDevice.Name,
                Ip = request.NewDevice.Ip,
                LocationId = request.NewDevice.LocationId
            };
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();

            // Get the created device from the database
            var modelDevice = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == device.Id);

            var location = await _context.Locations.FirstOrDefaultAsync(l => l.Id == request.NewDevice.LocationId);

            return new CreateDeviceResponse
            {
                Device = new Device
                {
                    Id = modelDevice.Id,
                    Name = modelDevice.Name,
                    Zigbee2MqttId = modelDevice.Zigbee2mqttId,
                    Ip = modelDevice.Ip,
                    Location = new Location
                    {
                        Id = location.Id,
                        X = location.X,
                        Y = location.Y,
                        Description = location.Description
                    }
                }
            };
        }
    }
}