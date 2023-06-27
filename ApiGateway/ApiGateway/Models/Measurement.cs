namespace ApiGateway.Models
{
    public class Measurement
    {
        public Measurement(int id, int deviceId, double temperature, double humidity, int battery, int signalStrength, DateTime timestamp)
        {
            Id = id;
            DeviceId = deviceId;
            Temperature = temperature;
            Humidity = humidity;
            Battery = battery;
            SignalStrength = signalStrength;
            Timestamp = timestamp;
        }

        public int Id { get; set;  }
        public int DeviceId { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public int Battery { get; set; }
        public int SignalStrength { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
