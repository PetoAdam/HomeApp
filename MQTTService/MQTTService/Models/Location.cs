using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MQTTService.Models
{
    public class Location
    {

        public Location()
        {

        }

        public Location(int id, int x, int y, string description)
        {
            Id = id;
            X = x;
            Y = y;
            Description = description;
        }

        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string Description { get; set; }
    }
}
