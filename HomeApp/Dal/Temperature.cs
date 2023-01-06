using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HomeApp.Dal
{
    public class Temperature
    {
        public int Id { get; set; }
        public int Value { get; set; }
        public DateTime Timestamp { get; set; }
        public int LocationId { get; set; }
    }
}
