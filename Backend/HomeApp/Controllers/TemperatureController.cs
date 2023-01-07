using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HomeApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HomeApp.Controllers
{
    [ApiController]
    [Route("api/temperatures")]
    public class TemperatureController : ControllerBase
    {
        private readonly Dal.ApplicationDbContext _context;

        public TemperatureController(Dal.ApplicationDbContext dbContext)
        {
            this._context = dbContext;
        }

        [HttpGet("day")]
        public async Task<ActionResult<Models.Temperature[]>> List(){
            var dbTemps = await _context.Temperatures.ToListAsync();
            var sortedTemps = dbTemps.Where(t => t.Timestamp > DateTime.Now.AddHours(-24) && t.Timestamp < DateTime.Now);

            var temps = new List<Models.Temperature>();
            foreach(var temp in sortedTemps)
            {
                var location = _context.Locations.FirstOrDefault(l => l.Id == temp.LocationId);
                var locationModel = new Models.Location(location.Id, location.Country, location.ZipCode, location.City, location.Street, location.Number, location.Description);
                temps.Add(new Models.Temperature(temp.Id, temp.Value, temp.Timestamp, locationModel));
            }
            return temps.ToArray();
        }

        [HttpPost]
        public IActionResult CreateTemperature(NewTemperature newTemperature)
        {
            // Create the temperature in the database
            var temp = new Dal.Temperature
            {
                Value = newTemperature.Value,
                Timestamp = DateTime.Now,
                LocationId = newTemperature.LocationId
            };
            _context.Temperatures.Add(temp);
            _context.SaveChanges();

            // Return the created temperature -  currently DAL not Models
            return Ok(temp);
        }
    }
}
