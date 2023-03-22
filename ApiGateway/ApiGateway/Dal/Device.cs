using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway.Dal
{
    public class Device
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Zigbee2mqttId { get; set; }
        public int LocationId { get; set; }
    }
}
