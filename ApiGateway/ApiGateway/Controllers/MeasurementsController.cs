using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiGateway.Models;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Grpc.Core;
using Google.Protobuf.WellKnownTypes;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/measurements")]
    public class MeasurementsController : ControllerBase
    {
        private readonly Dal.ApplicationDbContext _context;
        private readonly GrpcChannel _channel;
        private readonly Grpc.MeasurementService.MeasurementServiceClient _client;

        public MeasurementsController(Dal.ApplicationDbContext dbContext)
        {
            this._context = dbContext;
            this._channel = GrpcChannel.ForAddress("http://localhost:5043");
            this._client = new Grpc.MeasurementService.MeasurementServiceClient(this._channel);
        }

        [HttpGet("current")]
        public async Task<ActionResult<Models.Measurement>> GetCurrent(int deviceId)
        {
            var response = await _client.GetCurrentAsync(new Grpc.GetCurrentRequest { DeviceId = deviceId });
            if (response.Measurement == null)
            {
                return NotFound();
            }
            return new Models.Measurement(response.Measurement.Id, response.Measurement.DeviceId, response.Measurement.Data, response.Measurement.Timestamp.ToDateTime());
        }

        [HttpGet("day")]
        public async Task<ActionResult<Models.Measurement[]>> ListDay(int deviceId)
        {
            var response = await _client.ListDayAsync(new Grpc.ListDayRequest { DeviceId = deviceId });
            var temps = new List<Models.Measurement>();
            foreach (var measurement in response.Measurements)
            {
                temps.Add(new Models.Measurement(measurement.Measurement.Id, measurement.Measurement.DeviceId, measurement.Measurement.Data, measurement.Measurement.Timestamp.ToDateTime()));
            }
            return temps.ToArray();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateMeasurement([FromBody] Models.Measurement newMeasurement)
        {
            var response = await _client.CreateMeasurementAsync(new Grpc.CreateMeasurementRequest
            {
                DeviceId = newMeasurement.DeviceId,
                Data = newMeasurement.Data,
                Timestamp = Timestamp.FromDateTime(DateTime.Now.ToUniversalTime())
            });
            return CreatedAtAction(nameof(GetCurrent), new { deviceId = newMeasurement.DeviceId }, newMeasurement);
        }
    }
}
