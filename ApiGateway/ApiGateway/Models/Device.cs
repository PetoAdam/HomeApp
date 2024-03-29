﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiGateway.Models
{
    public class Device
    {

        public Device(int id, string name, string? zigbee2mqttId, string? ip, Location location)
        {
            Id = id;
            Name = name;
            Zigbee2mqttId = zigbee2mqttId;
            Ip = ip;
            Location = location;
        }


        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Zigbee2mqttId { get; set; }
        public string? Ip { get; set; }
        public Location Location { get; set; }
    }
}
