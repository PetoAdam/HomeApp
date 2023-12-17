using Newtonsoft.Json;

namespace ApiGateway.Authentication
{
    public class RefreshTokenRequest
    {
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
    }

}
