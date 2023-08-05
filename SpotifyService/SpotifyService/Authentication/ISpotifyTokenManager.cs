
namespace SpotifyService.Authentication
{
    public interface ISpotifyTokenManager
    {
        Task<string> GetValidAccessTokenAsync(); 
    }
}
