using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Google.Apis.PeopleService.v1;

namespace ApiGateway.Authentication
{
    public class GoogleClient
    {
        string REDIRECT_URI = "https://homenavi.org/api/users/auth/google";

        // Exchange the one-time use token for a Google access token
        // You can use the Google.Apis.Auth.OAuth2 library to do this
        // See https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code for more information
        // The access token should be returned as a string
        public async Task<string> ExchangeTokenAsync(string token)
        {
            // Create an HTTP client
            var client = new HttpClient();

            // Set the request parameters
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://oauth2.googleapis.com/token"),
                Content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("code", token),
                    new KeyValuePair<string, string>("client_id", Environment.GetEnvironmentVariable("CLIENT_ID")),
                    new KeyValuePair<string, string>("client_secret", Environment.GetEnvironmentVariable("CLIENT_SECRET")),
                    new KeyValuePair<string, string>("redirect_uri", REDIRECT_URI),
                    new KeyValuePair<string, string>("grant_type", "authorization_code")
                })
            };

            // Send the request
            var response = await client.SendAsync(request);

            // Read the response
            var responseText = await response.Content.ReadAsStringAsync();

            // Parse the response
            var responseObject = JsonConvert.DeserializeObject<JObject>(responseText);

            // Get the access token
            var accessToken = responseObject["access_token"].Value<string>();

            // Return the access token
            return accessToken;
        }

        public async Task<Profile> GetProfileAsync(string token)
        {
            // Create a People API service
            var service = new Google.Apis.PeopleService.v1.PeopleServiceService(new BaseClientService.Initializer
            {
                HttpClientInitializer = GoogleCredential.FromAccessToken(token),
                ApplicationName = "HomeApp"
            });

            // Get the user's profile
            var request = service.People.Get("people/me");
            request.PersonFields = "names,emailAddresses";

            var profile = await request.ExecuteAsync();



            // Return the profile as a Profile object
            return new Profile
            {
                Id = profile.ResourceName,
                Name = profile.Names.FirstOrDefault()?.DisplayName,
                Email = profile.EmailAddresses.FirstOrDefault()?.Value
            };
        }
    }
}
