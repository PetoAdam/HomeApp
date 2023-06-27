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
    public class LocationsService : LocationService.LocationServiceBase
    {
        private readonly Dal.ApplicationDbContext _context;
        private readonly ILogger<LocationsService> _logger;

        public LocationsService(Dal.ApplicationDbContext dbContext, ILogger<LocationsService> logger)
        {
            _context = dbContext;
            _logger = logger;
        }

        public override async Task<ListLocationsResponse> List(ListLocationsRequest request, ServerCallContext context)
        {
            var dbLocations = await _context.Locations.ToListAsync();
            var locations = new List<Location>();
            foreach (var location in dbLocations)
            {
                locations.Add(new Location
                {
                    Id = location.Id,
                    X = location.X,
                    Y = location.Y,
                    Description = location.Description
                });
            }

            return new ListLocationsResponse { Locations = { locations } };
        }

        public override async Task<LocationResponse> GetById(GetLocationRequest request, ServerCallContext context)
        {
            var location = await _context.Locations.FindAsync(request.Id);
            if (location == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Location not found"));
            }

            return new LocationResponse
            {
                Location = new Location
                {
                    Id = location.Id,
                    X = location.X,
                    Y = location.Y,
                    Description = location.Description
                }
            };
                
        }

        public override async Task<LocationResponse> Create(CreateLocationRequest request, ServerCallContext context)
        {
            var location = new Dal.Location
            {
                X = request.X,
                Y = request.Y,
                Description = request.Description
            };
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return new LocationResponse
            {
                Location = new Location
                {
                    Id = location.Id,
                    X = location.X,
                    Y = location.Y,
                    Description = location.Description
                }
            };
        }
    }
}