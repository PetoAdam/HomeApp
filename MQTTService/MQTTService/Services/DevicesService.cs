using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MQTTService.Models;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using NuGet.Common;

namespace MQTTService.Services
{
    public class DevicesService : DeviceService.DeviceServiceBase
    {

        private readonly ILogger<DevicesService> _logger;

        public DevicesService(ILogger<DevicesService> logger)
        {
            _logger = logger;
        }

        public override async Task<CreateDeviceResponse> CreateDevice(CreateDeviceRequest request, ServerCallContext context)
        {
            if(request.Ip == "unknown")
            {
                // Handle Zigbee pairing
                await CreateZigbeeDevice();
            }
            else
            {
                // Handle MQTT pairing
                // TODO
            }
            return new CreateDeviceResponse();
        }

        public override async Task<RemoveDeviceResponse> RemoveDevice(RemoveDeviceRequest request, ServerCallContext context)
        {
            if (request.Ip == "unknown")
            {
                // Handle Zigbee unpairing
                // TODO
            }
            else
            {
                // Handle MQTT unpairing
                // TODO
            }
            return new RemoveDeviceResponse();

        }

        private async Task CreateZigbeeDevice()
        {
            var mqttFactory = new MqttFactory();

            using (var mqttClient = mqttFactory.CreateMqttClient())
            {
                var mqttClientOptions = new MqttClientOptionsBuilder()
                    .WithTcpServer("mqtt")
                    .Build();

                await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);

                var pairMessage = new MqttApplicationMessageBuilder()
                .WithTopic("zigbee2mqtt/bridge/config/permit_join")
                .WithPayload("true")
                .Build();

                await mqttClient.PublishAsync(pairMessage, CancellationToken.None);

                _logger.Log(Microsoft.Extensions.Logging.LogLevel.Information, "Permit join set to true. Waiting for device to pair...");

                await Task.Delay(TimeSpan.FromSeconds(60));

                var unpairMessage = new MqttApplicationMessageBuilder()
                .WithTopic("zigbee2mqtt/bridge/config/permit_join")
                .WithPayload("false")
                .Build();

                await mqttClient.PublishAsync(unpairMessage, CancellationToken.None);

                await mqttClient.DisconnectAsync();

                _logger.Log(Microsoft.Extensions.Logging.LogLevel.Information, "Permit join set to false. If the pairing failed, try again.");
            }
    }
    }
}