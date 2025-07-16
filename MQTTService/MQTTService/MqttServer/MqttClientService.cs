using System.Text.RegularExpressions;
using System.Runtime.CompilerServices;
using MQTTnet;
using MQTTnet.Client;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Grpc.Core;
using Google.Protobuf.WellKnownTypes;
using Grpc.Net.Client;
using Newtonsoft.Json;

namespace MQTTService.MqttService
{
    public class MqttClientService
    {
        private readonly string BROKER_HOST = "192.168.0.122";
        private readonly int BROKER_PORT = 1883;
        private readonly string ZIGBEE_TOPIC = "zigbee2mqtt/#";
        private readonly ILogger<MqttClientService> logger;
        private readonly IMqttClient mqttClient;
        private readonly GrpcChannel grpcChannel;
        private readonly MeasurementService.MeasurementServiceClient grpcClient;

        public MqttClientService(ILogger<MqttClientService> logger)
        {
            this.logger = logger;

            this.grpcChannel = GrpcChannel.ForAddress("http://databaseservice:5043");
            this.grpcClient = new MeasurementService.MeasurementServiceClient(this.grpcChannel);

            mqttClient = new MqttFactory().CreateMqttClient();
            mqttClient.ConnectedAsync += OnConnected;
            mqttClient.DisconnectedAsync += OnDisconnected;
            mqttClient.ApplicationMessageReceivedAsync += OnMessageReceived;

            this.logger.LogInformation("MQTT client created.");
        }

        public async Task StartAsync()
        {
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(BROKER_HOST, BROKER_PORT)
                .WithClientId("HomeApp")
                .WithKeepAlivePeriod(TimeSpan.FromSeconds(5))
                .Build();
            await mqttClient.ConnectAsync(options);
        }

        private async Task OnConnected(MqttClientConnectedEventArgs arg)
        {
            logger.LogInformation("Connected to MQTT broker");

            await mqttClient.SubscribeAsync(new MqttTopicFilterBuilder()
                .WithTopic(ZIGBEE_TOPIC)
                .Build());
        }

        private async Task OnDisconnected(MqttClientDisconnectedEventArgs arg)
        {
            logger.LogInformation("Disconnected from MQTT broker, reconnecting in 5 seconds...");
            await Task.Delay(TimeSpan.FromSeconds(5));
            logger.LogInformation("Reconnecting...");
            await StartAsync();
        }

        private async Task OnMessageReceived(MqttApplicationMessageReceivedEventArgs arg)
        {
            logger.LogInformation("Incoming message on topic {0}: {1}", arg.ApplicationMessage.Topic, Encoding.UTF8.GetString(arg.ApplicationMessage.Payload));
            var payload = Encoding.UTF8.GetString(arg.ApplicationMessage.Payload);
            dynamic config = JObject.Parse(payload);

            // Handle permit join
            if (arg.ApplicationMessage.Topic == "zigbee2mqtt/bridge/config")
            {
                // Handle incoming message
                bool permitJoin = (bool)config.permit_join;
                logger.LogInformation("Permit join currently set to " + permitJoin);
            }

            // Handle new device
            else if (arg.ApplicationMessage.Topic == "zigbee2mqtt/bridge/log")
            {
                // Handle incoming message
                string type = (string)config.type;
                if(type == "device_announced"){
                    var name = (string)config.meta.friendly_name;
                    logger.LogInformation("New device successfully connected. Friendly name: " + name);
                }
            }

            // Should be the Topic for single devices
            // TODO: Check first if device with the given friendly_name exists. (low prio)
            else
            {
                var friendly_name = arg.ApplicationMessage.Topic.Split('/')[1];

                logger.LogInformation("Incoming data message from " + friendly_name);

                var response = await grpcClient.CreateMeasurementByFriendlyNameAsync(new CreateMeasurementByFriendlyNameRequest
                {
                    FriendlyName = friendly_name,
                    Data = payload,
                    Timestamp = Timestamp.FromDateTime(DateTime.Now.ToUniversalTime())
                });

                logger.LogInformation("Message from device: " + friendly_name + " sent.");
            }

        }

        public async Task PublishMessageAsync(string topic, string message)
        {
            var applicationMessage = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message)
                .WithRetainFlag()
                .Build();

            await mqttClient.PublishAsync(applicationMessage);
        }

        public async Task StopAsync()
        {
            await mqttClient.DisconnectAsync();
            logger.LogInformation("MQTT client stopped");
        }
    }
}
