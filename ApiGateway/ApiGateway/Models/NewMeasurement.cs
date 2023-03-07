using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway.Models
{
    public class NewMeasurement
    { 
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public int LocationId { get; set; }
    }
}
