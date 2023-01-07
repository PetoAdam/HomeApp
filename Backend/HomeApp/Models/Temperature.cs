using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeApp.Models
{
    public class Temperature
    {

        public Temperature(int id, int value, DateTime timestamp, Location location)
        {
            Id = id;
            Value = value;
            Timestamp = timestamp;
            Location = location;
        }


        public int Id { get; set; }
        public int Value { get; set; }
        public DateTime Timestamp { get; set; }
        public Location Location { get; set; }
    }
}
