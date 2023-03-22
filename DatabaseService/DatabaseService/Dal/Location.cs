using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseService.Dal
{
    public class Location
    {
        public int Id { get; set; }
        public int X { get; set; }  
        public int Y { get; set; }  
        public string Description { get; set; }
    }
}
