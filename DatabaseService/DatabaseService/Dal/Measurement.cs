namespace DatabaseService.Dal
{
    public class Measurement
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }  
        public string Data { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
