using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeApp.Models
{
    public class Location
    {
        public Location(int id, string country, string zipCode, string city, string street, string number, string description)
        {
            Id = id;
            Country = country;
            ZipCode = zipCode;
            City = city;
            Street = street;
            Number = number;
            Description = description;
        }

        public int Id { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string Description { get; set; }
    }
}
