using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApiGateway.Models;
using Grpc.Core;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/speakers")]
    public class SpeakersController : ControllerBase
    {
        private readonly GrpcChannel _channel;
        private readonly Grpc.SpeakerService.SpeakerServiceClient _client;

        public SpeakersController()
        {
            _channel = GrpcChannel.ForAddress("http://localhost:5046");
            _client = new Grpc.SpeakerService.SpeakerServiceClient(_channel);
        }

        [HttpGet("pairable")]
        public async Task<ActionResult<IEnumerable<DeviceInfo>>> ListPairableDevices()
        {
            var response = await _client.ListPairableDevicesAsync(new Grpc.ListPairableDevicesRequest());
            return Ok(response.Devices);
        }

        [HttpPost("connect")]
        public async Task<ActionResult<bool>> ConnectDevice([FromBody] ConnectSpeakerRequest requestBody)
        {
            if (string.IsNullOrWhiteSpace(requestBody?.DeviceAddress))
            {
                return BadRequest("Invalid device address");
            }
            var response = await _client.ConnectDeviceAsync(new Grpc.ConnectDeviceRequest { DeviceAddress = requestBody?.DeviceAddress });
            return Ok(response.Success);
        }

        [HttpPost("disconnect")]
        public async Task<ActionResult<bool>> DisconnectDevice([FromBody] DisconnectSpeakerRequest requestBody)
        {
            if (string.IsNullOrWhiteSpace(requestBody?.DeviceAddress))
            {
                return BadRequest("Invalid device address");
            }
            var response = await _client.DisconnectDeviceAsync(new Grpc.DisconnectDeviceRequest { DeviceAddress = requestBody?.DeviceAddress });
            return Ok(response.Success);
        }

        [HttpGet("connected")]
        public async Task<ActionResult<IEnumerable<DeviceInfo>>> ListConnectedSpeakers()
        {
            var response = await _client.ListConnectedSpeakersAsync(new Grpc.ListConnectedSpeakersRequest());
            return Ok(response.Speakers);
        }
    }
}
