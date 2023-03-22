namespace DatabaseService.Dal
{
    public class Measurement
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }  
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public int Battery { get; set; }
        public int SignalStrength { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
