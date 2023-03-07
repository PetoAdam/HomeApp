using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway.Models
{
    public class Measurement
    {

        public Measurement(int id, double temperature, double humidity, DateTime timestamp, Location location)
        {
            Id = id;
            Temperature = temperature;
            Humidity = humidity;
            Timestamp = timestamp;
            Location = location;
        }


        public int Id { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public DateTime Timestamp { get; set; }
        public Location Location { get; set; }
    }
}
