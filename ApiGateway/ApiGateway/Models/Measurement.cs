namespace ApiGateway.Models
{
    public class Measurement
    {
        public Measurement(int id, int deviceId, string data, DateTime timestamp)
        {
            Id = id;
            DeviceId = deviceId;
            Data = data;
            Timestamp = timestamp;
        }

        public int Id { get; set;  }
        public int DeviceId { get; set; }
        public string Data{ get; set; }
        public DateTime Timestamp { get; set; }
    }
}
