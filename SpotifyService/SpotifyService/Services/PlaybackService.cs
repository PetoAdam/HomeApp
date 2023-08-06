using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using SpotifyService.Authentication;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Net;
using System.Text;

namespace SpotifyService.Services
{
    public class PlaybackService : SpotifyService.SpotifyServiceBase
    {   
        // This DEVICE_ID is the Spotify device ID of the home server, to obtain it run: 
        // curl --request GET \
        //--url https://api.spotify.com/v1/me/player/devices \
        //--header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'
        private string DEVICE_ID = Environment.GetEnvironmentVariable("SPOTIFY_DEVICE_ID");
        private readonly ILogger<PlaybackService> _logger;
        private readonly ISpotifyTokenManager _tokenManager;

        public PlaybackService(ILogger<PlaybackService> logger, ISpotifyTokenManager tokenManager)
        {
            this._logger = logger;
            this._tokenManager = tokenManager;
        }

        public override async Task<TrackInfoResponse> GetTrackInfo(TrackInfoRequest request, ServerCallContext context)
        {
            // Retrieve the access token using the token manager
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();

            // Make a request to the Spotify API to get track information
            var trackId = request.TrackId; // Assuming the TrackInfoRequest message has a field named TrackId
            var apiUrl = $"https://api.spotify.com/v1/tracks/{trackId}";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic trackData = Newtonsoft.Json.JsonConvert.DeserializeObject(responseBody);

                    // Extract the track information from the response
                    string title = trackData.name;
                    string artist = trackData.artists[0].name;

                    // Create and return the TrackInfoResponse message
                    var trackInfoResponse = new TrackInfoResponse
                    {
                        Title = title,
                        Artist = artist
                    };

                    return trackInfoResponse;
                }
                else
                {
                    // Handle API error here if needed
                    throw new RpcException(new Status(StatusCode.Internal, "Error while fetching track information"));
                }
            }
        }

        public override async Task<Empty> PausePlayback(Empty request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string apiUrl = "https://api.spotify.com/v1/me/player/pause";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.PutAsync(apiUrl, null);

                if (!response.IsSuccessStatusCode)
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while pausing playback"));
                }
            }

            return new Empty();
        }

        public override async Task<Empty> ContinuePlayback(Empty request, ServerCallContext context)
        {
            // Playback is always started/continued on the spotifyd device.
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();

            string playbackStatusUrl = "https://api.spotify.com/v1/me/player";
            string transferPlaybackUrl = "https://api.spotify.com/v1/me/player";
            string playUrl = "https://api.spotify.com/v1/me/player/play?device_id=" + DEVICE_ID;


            using (var httpClient = new HttpClient())
            {
                bool transferPlayback = false;
                bool isPlaying = false;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                // Check playback status
                var playbackStatusResponse = await httpClient.GetAsync(playbackStatusUrl);
                if (playbackStatusResponse.IsSuccessStatusCode)
                {
                    if (playbackStatusResponse.StatusCode == HttpStatusCode.NoContent)
                    {
                        // No active playback available
                        transferPlayback = true;
                    }
                    else
                    {
                        // There is an active playback
                        // Check device. If it is the correct device, playback transfer is not neccessary
                        var playbackStatusResponseBody = await playbackStatusResponse.Content.ReadAsStringAsync();
                        dynamic playbackData = JsonConvert.DeserializeObject(playbackStatusResponseBody);
                        string deviceId = playbackData.device.id;
                        isPlaying = playbackData.is_playing;
                        if(deviceId != DEVICE_ID)
                        {
                            transferPlayback = true;
                        }
                    }
                }
                else
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while getting current playback info"));
                }

                if (transferPlayback)
                {
                    // Transfer playback
                    var requestBody = new
                    {
                        device_ids = new string[] { DEVICE_ID },
                        play = true
                    };
                    var requestBodyJson = JsonConvert.SerializeObject(requestBody);
                    var content = new StringContent(requestBodyJson, Encoding.UTF8, "application/json");
                    
                    var transferResponse = await httpClient.PutAsync(transferPlaybackUrl, content);

                    if (!transferResponse.IsSuccessStatusCode)
                    {
                        throw new RpcException(new Status(StatusCode.Internal, "Error while transferring playback"));
                    }
                }
                
                // Start playing if not playing already
                if(!isPlaying)
                {
                    var response = await httpClient.PutAsync(playUrl, null);

                    if (response.StatusCode != HttpStatusCode.Accepted)
                    {
                        throw new RpcException(new Status(StatusCode.Internal, "Error while continuing playback"));
                    }
                }
                
            }

            return new Empty();
        }


        public override async Task<Empty> ChangeVolume(VolumeChangeRequest request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            int volume = request.Volume;
            string apiUrl = $"https://api.spotify.com/v1/me/player/volume?volume_percent={volume}";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.PutAsync(apiUrl, null);

                if (!response.IsSuccessStatusCode)
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while changing volume"));
                }
            }

            return new Empty();
        }

        public override async Task<Empty> SkipSong(Empty request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string apiUrl = "https://api.spotify.com/v1/me/player/next";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.PostAsync(apiUrl, null);

                if (!response.IsSuccessStatusCode)
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while skipping song"));
                }
            }

            return new Empty();
        }

        public override async Task<Empty> PlayPreviousSong(Empty request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string apiUrl = "https://api.spotify.com/v1/me/player/previous";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.PostAsync(apiUrl, null);

                if (!response.IsSuccessStatusCode)
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while playing previous song"));
                }
            }

            return new Empty();
        }

        public override async Task<Empty> AddToQueue(AddToQueueRequest request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string trackId = request.TrackId;
            string apiUrl = $"https://api.spotify.com/v1/me/player/queue?uri=spotify:track:{trackId}";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.PostAsync(apiUrl, null);

                if (!response.IsSuccessStatusCode)
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while adding song to queue"));
                }
            }

            return new Empty();
        }

        public override async Task<SearchResponse> SearchSongs(SearchRequest request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string query = request.Query;
            string apiUrl = $"https://api.spotify.com/v1/search?q={query}&type=track";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic searchResults = JsonConvert.DeserializeObject(responseBody);

                    var songs = new List<Song>();
                    foreach (var item in searchResults.tracks.items)
                    {
                        var song = new Song
                        {
                            Title = item.name,
                            Artist = item.artists[0].name,
                            Album = item.album.name,
                            TrackId = item.id,
                            AlbumImageUri = item.album.images[0].url ??= ""
                        };
                        songs.Add(song);
                    }

                    return new SearchResponse { Songs = { songs } };
                }
                else
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while searching for songs"));
                }
            }
        }

        public override async Task<ListQueueResponse> ListQueue(Empty request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string apiUrl = "https://api.spotify.com/v1/me/player/queue";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == HttpStatusCode.NoContent)
                    {
                        // No active playback available
                        return new ListQueueResponse();
                    }
                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic queueData = JsonConvert.DeserializeObject(responseBody);

                    var queue = new List<Song>();
                    foreach (var item in queueData.queue)
                    {
                        var song = new Song
                        {
                            Title = item.name,
                            Artist = item.artists[0].name,
                            Album = item.album.name,
                            TrackId = item.id,
                            AlbumImageUri = item.album.images[0].url ??= ""
                        };
                        queue.Add(song);
                    }

                    return new ListQueueResponse { Queue = { queue } };
                }
                else
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while listing queue"));
                }
            }
        }

        public override async Task<PlaybackInfoResponse> GetCurrentPlaybackInfo(Empty request, ServerCallContext context)
        {
            string accessToken = await _tokenManager.GetValidAccessTokenAsync();
            string apiUrl = "https://api.spotify.com/v1/me/player";

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == HttpStatusCode.NoContent)
                    {
                        // No active playback available
                        return new PlaybackInfoResponse();
                    }

                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic playbackData = JsonConvert.DeserializeObject(responseBody);
                    
                    string deviceId = playbackData.device.id;
                    bool isPlaying = playbackData.is_playing;
                    int volume = playbackData.device.volume_percent;
                    long time = playbackData.progress_ms;
                    long duration = playbackData.item.duration_ms;
                    string title = playbackData.item.name;
                    string artist = playbackData.item.artists[0].name;
                    string album = playbackData.item.album.name;
                    string albumImageUri = playbackData.item.album.images[0].url ??= "";

                    return new PlaybackInfoResponse
                    {   
                        IsPlaying = isPlaying,
                        Volume = volume,
                        Time = time,
                        Duration = duration,
                        Title = title,
                        Artist = artist,
                        Album = album,
                        AlbumImageUri = albumImageUri
                    };
                }
                else
                {
                    throw new RpcException(new Status(StatusCode.Internal, "Error while getting current playback info"));
                }
            }
        }
    }
}
