using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatabaseService.Dal;
using DatabaseService.Models;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatabaseService.Services
{
    public class MeasurementsService : MeasurementService.MeasurementServiceBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MeasurementsService> _logger;

        public MeasurementsService(ApplicationDbContext context, ILogger<MeasurementsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public override async Task<MeasurementResponse> GetCurrent(GetCurrentRequest request, ServerCallContext context)
        {
            try
            {
                var dbMeasurement = await _context.Measurements.FirstOrDefaultAsync(m => m.Timestamp == _context.Measurements.Max(x => x.Timestamp) && m.DeviceId == request.DeviceId);
                if (dbMeasurement == null)
                {
                    return new MeasurementResponse();
                }
                return new MeasurementResponse
                {
                    Measurement = new Measurement
                    {
                        Id = dbMeasurement.Id,
                        DeviceId = dbMeasurement.DeviceId,
                        Temperature = dbMeasurement.Temperature,
                        Humidity = dbMeasurement.Humidity,
                        Battery = dbMeasurement.Battery,
                        SignalStrength = dbMeasurement.SignalStrength,
                        Timestamp = Timestamp.FromDateTime(dbMeasurement.Timestamp.ToUniversalTime())
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching current measurement");
                throw new RpcException(new Status(StatusCode.Internal, "An error occurred while fetching current measurement"));
            }
        }

        public override async Task<MeasurementListResponse> ListDay(ListDayRequest request, ServerCallContext context)
        {
            var measurements = await _context.Measurements
            .Where(m => m.DeviceId == request.DeviceId && m.Timestamp > DateTime.Now.AddDays(-1))
            .Select(m => new MeasurementResponse
            {
                Measurement = new Measurement
                {
                    Id = m.Id,
                    DeviceId = m.DeviceId,
                    Temperature = m.Temperature,
                    Humidity = m.Humidity,
                    Battery = m.Battery,
                    SignalStrength = m.SignalStrength,
                    Timestamp = Timestamp.FromDateTime(m.Timestamp.ToUniversalTime())
                }
                
            })
            .ToListAsync();

            var response = new MeasurementListResponse();
            response.Measurements.AddRange(measurements);

            return response;

        }

        public override async Task<Empty> CreateMeasurement(CreateMeasurementRequest request, ServerCallContext context)
        {
            var temp = new Dal.Measurement
            {
                DeviceId = request.DeviceId,
                Temperature = request.Temperature,
                Humidity = request.Humidity,
                Battery = request.Battery,
                SignalStrength = request.SignalStrength,
                Timestamp = request.Timestamp.ToDateTime()
            };

            _context.Measurements.Add(temp);
            await _context.SaveChangesAsync();

            return new Empty();

        }
    }
}