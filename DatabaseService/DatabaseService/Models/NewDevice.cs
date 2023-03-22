using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseService.Models
{
    public class NewDevice
    {
        public NewDevice()
        {

        }
        public string? Name { get; set; }
        public int LocationId { get; set; }
    }
}
