using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiGateway.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Grpc.Core;
using Google.Protobuf.Reflection;
using Grpc.Net.Client;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class LocationsController : ControllerBase
    {
        private readonly Dal.ApplicationDbContext _context;
        private readonly GrpcChannel _channel;
        private readonly Grpc.LocationService.LocationServiceClient _client;

        public LocationsController(Dal.ApplicationDbContext dbContext)
        {
            this._context = dbContext;
            this._channel = GrpcChannel.ForAddress("http://databaseservice:5043");
            this._client = new Grpc.LocationService.LocationServiceClient(this._channel);
        }

        [HttpGet]
        public async Task<ActionResult<Models.Location[]>> List()
        {
            var response = await this._client.ListAsync(new Grpc.ListLocationsRequest());
            var locations = response.Locations.Select(l => new Models.Location(l)).ToArray();
            return locations;
        }

        [HttpGet("{locationId}")]
        public async Task<ActionResult<Models.Location>> GetLocationById(int locationId)
        {
            try
            {
                var request = new Grpc.GetLocationRequest { Id = locationId };
                var response = await this._client.GetByIdAsync(request);
                return new Models.Location(response.Location);
            }
            catch (RpcException ex)
            {
                return NotFound();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateLocation([FromBody] Location newLocation)
        {
            // Create the location in the database
            var request = new Grpc.CreateLocationRequest
            {
                X = newLocation.X,
                Y = newLocation.Y,
                Description = newLocation.Description
            };
            var response = await this._client.CreateAsync(request);

            // Return the created location
            var locationUrl = Url.Action("GetLocationById", new { locationId = response.Location.Id });
            return Created(locationUrl, new Models.Location(response.Location));
        }
    }
}
