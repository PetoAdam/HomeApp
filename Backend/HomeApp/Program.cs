using HomeApp.Dal;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySql.EntityFrameworkCore.Extensions;
using System.Text;
using System.Net;
using System.Security.Cryptography.X509Certificates;

var JWT_SIGNING_KEY = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY");
var ISSUER = "homeapp.ddns.net";
var AUDIENCE = "homeapp.ddns.net";
var HTTPS_PEM = Environment.GetEnvironmentVariable("HTTPS_PEM");
var HTTPS_KEY_PEM = Environment.GetEnvironmentVariable("HTTPS_KEY_PEM");
var HTTPS_CERTIFICATE = X509Certificate2.CreateFromPemFile(HTTPS_PEM, HTTPS_KEY_PEM);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.WebHost.UseKestrel(options =>
{
    options.Listen(IPAddress.Any, 5001, listenOptions =>
    {
        listenOptions.UseHttps(HTTPS_CERTIFICATE);
    });
});

builder.Services.AddEntityFrameworkMySQL().AddDbContext<ApplicationDbContext>(options => {
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("*")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = ISSUER,
                ValidAudience = AUDIENCE,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_SIGNING_KEY))
            };
        });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();


app.Run();
