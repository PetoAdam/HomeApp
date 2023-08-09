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
        private readonly HttpClient _httpClient;

        private (string AccessToken, long ExpirationTime) _tokenCache = (null, 0);

        public AuthorizationCodeSpotifyTokenManager(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("SpotifyApiClient");
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

                var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "refresh_token"),
                    new KeyValuePair<string, string>("refresh_token", refreshToken)
                });

                try
                {
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

                        // Update the cache with the new token
                        _tokenCache = (accessToken, expirationTime);
                        await File.WriteAllTextAsync(tokenFile, JsonConvert.SerializeObject(tokenObj));
                        
                    }
                }
                catch (Exception ex)
                {
                    // Handle exceptions and log errors
                    Console.WriteLine("Error while obtaining access token: " + ex.Message);
                }
            }

            return accessToken;
        }

        private async Task<(string AccessToken, long ExpirationTime)> LoadTokenAsync(string tokenFile)
        {
            if (_tokenCache.ExpirationTime > DateTimeOffset.UtcNow.ToUnixTimeSeconds())
            {
                return _tokenCache; // Return cached token if still valid
            }

            if (File.Exists(tokenFile))
            {
                try
                {
                    string tokenData = await File.ReadAllTextAsync(tokenFile);
                    var tokenObj = JsonConvert.DeserializeObject<dynamic>(tokenData);

                    string accessToken = tokenObj.access_token;
                    long expirationTime = tokenObj.expiration_time;

                    _tokenCache = (accessToken, expirationTime); // Update the cache

                    return (accessToken, expirationTime);
                }
                catch (Exception ex)
                {
                    // Handle exceptions and log errors
                    Console.WriteLine("Error while loading access token: " + ex.Message);
                }
            }
            return (null, 0);
        }
    }
}
