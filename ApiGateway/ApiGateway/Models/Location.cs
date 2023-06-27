using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway.Models
{
    public class Location
    {
        public Location(Grpc.Location location)
        {
            Id = location.Id;
            X = location.X;
            Y = location.Y; 
            Description = location.Description;
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
