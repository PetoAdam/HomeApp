using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Grpc.Net.Client;
using Grpc.Core;
using Newtonsoft.Json;
using System.Text.Json;
using ApiGateway.Models;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/spotify")]
    public class SpotifyController : ControllerBase
    {
        private readonly GrpcChannel _channel;
        private readonly Grpc.SpotifyService.SpotifyServiceClient _spotifyClient;

        public SpotifyController()
        {
            _channel = GrpcChannel.ForAddress("http://localhost:5045");
            _spotifyClient = new Grpc.SpotifyService.SpotifyServiceClient(_channel);
        }

        [HttpGet("track/{trackId}")]
        public async Task<IActionResult> GetTrackInfo(string trackId)
        {
            var request = new Grpc.TrackInfoRequest { TrackId = trackId };
            var response = await _spotifyClient.GetTrackInfoAsync(request);
            return Ok(response);
        }

        [HttpPost("pause")]
        public async Task<IActionResult> PausePlayback()
        {
            var request = new Grpc.Empty();
            await _spotifyClient.PausePlaybackAsync(request);
            return NoContent();
        }

        [HttpPost("play")]
        public async Task<IActionResult> ContinuePlayback()
        {
            var request = new Grpc.Empty();
            await _spotifyClient.ContinuePlaybackAsync(request);
            return NoContent();
        }

        [HttpPost("volume")]
        public async Task<IActionResult> ChangeVolume([FromBody] ChangeVolumeRequest requestBody)
        {
            if (requestBody != null)
            {
                int volume = requestBody.Volume;
                Console.WriteLine("Volume: " + volume);
                var grpcRequest = new Grpc.VolumeChangeRequest { Volume = volume };
                await _spotifyClient.ChangeVolumeAsync(grpcRequest);
                return NoContent();
            }
            else
            {
                return BadRequest("Invalid JSON payload");
            }
        }


        [HttpPost("skip")]
        public async Task<IActionResult> SkipSong()
        {
            var request = new Grpc.Empty();
            await _spotifyClient.SkipSongAsync(request);
            return NoContent();
        }

        [HttpPost("previous")]
        public async Task<IActionResult> PlayPreviousSong()
        {
            var request = new Grpc.Empty();
            await _spotifyClient.PlayPreviousSongAsync(request);
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchSongs(string query)
        {
            var request = new Grpc.SearchRequest { Query = query };
            var response = await _spotifyClient.SearchSongsAsync(request);
            return Ok(response);
        }

        [HttpPost("queue")]
        public async Task<IActionResult> AddToQueue([FromBody] AddToQueueRequest requestBody)
        {
            if (requestBody != null)
            {
                string trackId = requestBody.TrackId;
                var request = new Grpc.AddToQueueRequest { TrackId = trackId };
                await _spotifyClient.AddToQueueAsync(request);
                return NoContent();
            }
            else
            {
                return BadRequest("Invalid JSON payload");
            }
        }


        [HttpGet("queue")]
        public async Task<IActionResult> ListQueue()
        {
            var request = new Grpc.Empty();
            var response = await _spotifyClient.ListQueueAsync(request);
            return Ok(response);
        }

        [HttpGet("playback")]
        public async Task<IActionResult> GetCurrentPlaybackInfo()
        {
            var request = new Grpc.Empty();
            var response = await _spotifyClient.GetCurrentPlaybackInfoAsync(request);
            return Ok(response);
        }
    }
}
