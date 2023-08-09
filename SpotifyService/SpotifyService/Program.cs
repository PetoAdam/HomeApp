using SpotifyService.Services;
using SpotifyService.Authentication;

Console.WriteLine("Starting SpotifyService...");

var builder = WebApplication.CreateBuilder(args);

// Additional configuration is required to successfully run gRPC on macOS.
// For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682

// Add services to the container.
builder.Services.AddGrpc();

builder.Services.AddHttpClient("SpotifyApiClient");

// Inject Spotify Token Manager to the services
// Currently using Authorization code flow to access user's playback data
builder.Services.AddScoped<ISpotifyTokenManager, AuthorizationCodeSpotifyTokenManager>();


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseDeveloperExceptionPage();

app.MapGrpcService<PlaybackService>();

app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

Console.WriteLine("SpotifyService successfully started.");

app.Run();
