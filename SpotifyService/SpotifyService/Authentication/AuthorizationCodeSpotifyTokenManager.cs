using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;

namespace SpotifyService.Authentication
{
    public class AuthorizationCodeSpotifyTokenManager : ISpotifyTokenManager
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        private async Task<(string AccessToken, long ExpirationTime)> LoadTokenAsync(string tokenFile)
        {
            if (File.Exists(tokenFile))
            {
                string tokenData = await File.ReadAllTextAsync(tokenFile);
                var tokenObj = JsonConvert.DeserializeObject<dynamic>(tokenData);

                string accessToken = tokenObj.access_token;
                long expirationTime = tokenObj.expiration_time;

                return (accessToken, expirationTime);
            }

            return (null, 0);
        }

        public async Task<string> GetValidAccessTokenAsync()
        {
            var tokenFile = "spotify_token.json";
            var (accessToken, expirationTime) = await LoadTokenAsync(tokenFile);

            if (string.IsNullOrEmpty(accessToken) || DateTimeOffset.UtcNow.ToUnixTimeSeconds() > expirationTime)
            {
                var clientId = Environment.GetEnvironmentVariable("SPOTIFY_CLIENT_ID");
                var clientSecret = Environment.GetEnvironmentVariable("SPOTIFY_CLIENT_SECRET");
                var refreshToken = Environment.GetEnvironmentVariable("SPOTIFY_REFRESH_TOKEN");

                var authOptions = new
                {
                    url = "https://accounts.spotify.com/api/token",
                    form = new
                    {
                        grant_type = "refresh_token",
                        refresh_token = refreshToken
                    }
                };

                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "refresh_token"),
                    new KeyValuePair<string, string>("refresh_token", refreshToken)
                });

                var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                var response = await _httpClient.PostAsync(authOptions.url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic tokenResponse = JsonConvert.DeserializeObject(responseBody);
                    accessToken = tokenResponse.access_token;
                    expirationTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + (long)tokenResponse.expires_in;

                    var tokenObj = new
                    {
                        access_token = accessToken,
                        expiration_time = expirationTime
                    };

                    await File.WriteAllTextAsync(tokenFile, JsonConvert.SerializeObject(tokenObj));
                }
            }

            return accessToken;
        }
    }
}
