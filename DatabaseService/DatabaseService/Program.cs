using DatabaseService.Dal;
using DatabaseService.Services;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions;

Console.WriteLine("Starting DatabaseService...");

var builder = WebApplication.CreateBuilder(args);

// Additional configuration is required to successfully run gRPC on macOS.
// For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682

// Add services to the container.
builder.Services.AddGrpc();

// Add database context to the container.
builder.Services.AddEntityFrameworkMySQL().AddDbContext<ApplicationDbContext>(options => {
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Configure Kestrel to listen on ports 5043 and 7043
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5043);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseDeveloperExceptionPage();

app.MapGrpcService<GreeterService>();
app.MapGrpcService<MeasurementsService>();
app.MapGrpcService<DevicesService>();
app.MapGrpcService<LocationsService>();

app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

Console.WriteLine("DatabaseService successfully started.");

app.Run();
