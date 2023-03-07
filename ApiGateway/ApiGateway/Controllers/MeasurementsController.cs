using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiGateway.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/temperatures")]
    public class MeasurementsController : ControllerBase
    {
        private readonly Dal.ApplicationDbContext _context;

        public MeasurementsController(Dal.ApplicationDbContext dbContext)
        {
            this._context = dbContext;
        }

        [HttpGet("current")]
        public async Task<ActionResult<Models.Measurement>> GetCurrent()
        {
            var dbTemp = await _context.Measurements.FirstOrDefaultAsync(t => t.Timestamp == _context.Measurements.Max(x => x.Timestamp));
            var location = _context.Locations.FirstOrDefault(l => l.Id == dbTemp.LocationId);
            return new Models.Measurement(dbTemp.Id, dbTemp.Temperature, dbTemp.Humidity, dbTemp.Timestamp, new Models.Location(location));
        }

        [HttpGet("day")]
        public async Task<ActionResult<Models.Measurement[]>> ListDay(){
            var dbTemps = await _context.Measurements.ToListAsync();
            var sortedTemps = dbTemps.Where(t => t.Timestamp > DateTime.Now.AddHours(-24) && t.Timestamp < DateTime.Now);

            var temps = new List<Models.Measurement>();
            foreach(var temp in sortedTemps)
            {
                var location = _context.Locations.FirstOrDefault(l => l.Id == temp.LocationId);
                temps.Add(new Models.Measurement(temp.Id, temp.Temperature, temp.Humidity, temp.Timestamp, new Models.Location(location)));
            }
            return temps.ToArray();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTemperature([FromBody] NewMeasurement newMeasurement)
        {
            // Create the temperature in the database
            var temp = new Dal.Measurement
            {
                Temperature = newMeasurement.Temperature,
                Humidity = newMeasurement.Humidity,
                Timestamp = DateTime.Now,
                LocationId = newMeasurement.LocationId
            };
            _context.Measurements.Add(temp);
            _context.SaveChanges();
            var modelTemp = await GetCurrent();
            // Return the created temperature -  currently DAL not Models
            return CreatedAtAction(nameof(GetCurrent), modelTemp);
        }
    }
}
