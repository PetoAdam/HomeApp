using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ApiGateway.Authentication;
using ApiGateway.Dal;
using ApiGateway.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ZstdNet;
using ApiGateway.Services;

namespace ApiGateway.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly Dal.ApplicationDbContext _context;

        public UsersController(Dal.ApplicationDbContext dbContext)
        {
            this._context = dbContext;
        }

        [HttpPost("auth/refresh")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest refreshTokenRequest)
        {   
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var refreshToken = jwtTokenHandler.ReadToken(refreshTokenRequest.RefreshToken) as JwtSecurityToken;

            // Validate the refresh token
            // Check if the refresh token is valid
            if (!ValidateRefreshToken(refreshToken))
            {
                return Unauthorized();
            }
            
            // If the refresh token is valid, generate a new access token
            var accessToken = GenerateJwtToken(refreshToken.Claims, DateTime.Now.AddDays(1));
            var accessTokenValidity = "86400"; // seconds (seconds in a day)

            // Add the JWT token to a cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,
                Secure = true, // for HTTPS
                SameSite = SameSiteMode.Strict
            };
            Response.Cookies.Append("access_token", accessToken, cookieOptions);
            Response.Cookies.Append("access_token_expires_in", accessTokenValidity, cookieOptions);
            Response.Cookies.Append("refresh_token", refreshTokenRequest.RefreshToken, cookieOptions);

            // Return the JWT token
            return Ok();
        }

        [HttpGet("auth/google")]
        public async Task<RedirectResult> GoogleAuth(string code)
        {
            // Exchange the authorization code for a Google access token
            var googleClient = new GoogleClient();
            string accessToken = await googleClient.ExchangeTokenAsync(code);

            if (string.IsNullOrEmpty(accessToken))
            {
                return new RedirectResult("http://homeapp.ddns.net/profile");
            }

            // Get the user's Google profile
            var profile = await googleClient.GetProfileAsync(accessToken);
            if (profile == null)
            {
                return new RedirectResult("http://homeapp.ddns.net/profile");
            }

            // Check if the user exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == profile.Email.ToUpper());
            if (user == null)
            {
                // Create a new user
                user = new IdentityUser
                {
                    UserName = profile.Email,
                    NormalizedUserName = profile.Email.ToUpper(),
                    Email = profile.Email,
                    NormalizedEmail = profile.Email.ToUpper(),
                    EmailConfirmed = true,
                    TwoFactorEnabled = false,
                    LockoutEnabled = false,
                    AccessFailedCount = 0
                };
                // Add user to database with default roles.
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                await _context.UserRoles.AddAsync(new IdentityUserRole { UserId = user.Id, RoleId = 2});
                await _context.SaveChangesAsync();
            }

            // Get the user's roles
            var userRoles = _context.UserRoles.Where(ur => ur.UserId == user.Id);
            var userRoleIds = userRoles.Select(ur => ur.RoleId);
            var roles = _context.Roles.Where(r => userRoleIds.Contains(r.Id)).Select(r => r.Name);

            // Create the JWT token
            var token = CreateToken(profile, roles);

            // Add the JWT token to a cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,
                Secure = true, // for HTTPS
                SameSite = SameSiteMode.Strict
            };
            Response.Cookies.Append("access_token", token.accessToken, cookieOptions);
            Response.Cookies.Append("access_token_expires_in", token.accessTokenValidity, cookieOptions);
            Response.Cookies.Append("refresh_token", token.refreshToken, cookieOptions);


            // Return the JWT token
            return new RedirectResult("http://homeapp.ddns.net/profile");
        }

        [HttpPost("auth/login")]
        public async Task<IActionResult> Login([FromBody] Authentication.LoginInfo loginInfo)
        {

            if (string.IsNullOrEmpty(loginInfo.Email) || string.IsNullOrEmpty(loginInfo.Password))
            {
                return Unauthorized();
            }

            // Check if the user exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == loginInfo.Email.ToUpper() && u.PasswordHash == Hasher.GetHashString(loginInfo.Password));
            if (user == null)
            {
                return Unauthorized();
            }

            var profile = new Authentication.Profile
            {
                Id = user.Id.ToString(),
                Name = user.UserName,
                Email = user.Email
            };

            // Get the user's roles
            var userRoles = _context.UserRoles.Where(ur => ur.UserId == user.Id);
            var userRoleIds = userRoles.Select(ur => ur.RoleId);
            var roles = _context.Roles.Where(r => userRoleIds.Contains(r.Id)).Select(r => r.Name);

            // Create the JWT token
            var token = CreateToken(profile, roles);

            // Add the JWT token to a cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,
                Secure = true, // for HTTPS
                SameSite = SameSiteMode.Strict
            };
            Response.Cookies.Append("access_token", token.accessToken, cookieOptions);
            Response.Cookies.Append("access_token_expires_in", token.accessTokenValidity, cookieOptions);
            Response.Cookies.Append("refresh_token", token.refreshToken, cookieOptions);


            // Return the JWT token
            return Ok();
        }

        [HttpPost("auth/signup")]
        public async Task<IActionResult> Signup([FromBody] Authentication.LoginInfo loginInfo)
        {

            if (string.IsNullOrEmpty(loginInfo.Email) || string.IsNullOrEmpty(loginInfo.Password) || string.IsNullOrEmpty(loginInfo.Username))
            {
                return Unauthorized();
            }

            // Check if the user exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == loginInfo.Email.ToUpper());
            if (user != null)
            {
                return Unauthorized();
            }
            
            // Create a new user
            user = new IdentityUser
            {
                UserName = loginInfo.Username,
                NormalizedUserName = loginInfo.Username.ToUpper(),
                Email = loginInfo.Email,
                NormalizedEmail = loginInfo.Email.ToUpper(),
                EmailConfirmed = false,
                PasswordHash = ApiGateway.Services.Hasher.GetHashString(loginInfo.Password),
                TwoFactorEnabled = false,
                LockoutEnabled = false,
                AccessFailedCount = 0
            };
            // Add user to database with default roles.
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            await _context.UserRoles.AddAsync(new IdentityUserRole { UserId = user.Id, RoleId = 2});
            await _context.SaveChangesAsync();

            // Get the user's roles
            var userRoles = _context.UserRoles.Where(ur => ur.UserId == user.Id);
            var userRoleIds = userRoles.Select(ur => ur.RoleId);
            var roles = _context.Roles.Where(r => userRoleIds.Contains(r.Id)).Select(r => r.Name);

            var profile = new Authentication.Profile
            {
                Id = user.Id.ToString(),
                Name = user.UserName,
                Email = user.Email
            };

            // Create the JWT token
            var token = CreateToken(profile, roles);

            // Add the JWT token to a cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,
                Secure = true, // for HTTPS
                SameSite = SameSiteMode.Strict
            };
            Response.Cookies.Append("access_token", token.accessToken, cookieOptions);
            Response.Cookies.Append("access_token_expires_in", token.accessTokenValidity, cookieOptions);
            Response.Cookies.Append("refresh_token", token.refreshToken, cookieOptions);


            // Return the JWT token
            return Ok();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<Dal.IdentityUser> Info(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        private (string accessToken, string accessTokenValidity, string refreshToken) CreateToken(Profile profile, IEnumerable<string> roles)
        {
            // Create a list of custom claims
            var claims = new List<Claim>
            {
                new Claim("user_id", profile.Id),
                new Claim("name", profile.Name),
                new Claim("email", profile.Email),
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Create the access token
            var accessTokenExpiration = DateTime.Now.AddDays(1);
            var accessToken = GenerateJwtToken(claims, accessTokenExpiration);
            var accessTokenValidity = "86400"; // seconds (seconds in a day)

            // Create the refresh token
            var refreshTokenExpiration = DateTime.MaxValue;
            var refreshToken = GenerateJwtToken(claims, refreshTokenExpiration);

            // TODO: Store refresh token
            // TODO: Maybe token revocation for refresh tokens

            // Return tokens
            return (accessToken, accessTokenValidity, refreshToken);
        }

        private string GenerateJwtToken(IEnumerable<Claim> claims, DateTime expiration)
        {
            var jwtToken = new JwtSecurityToken(
                issuer: "homeapp.ddns.net",
                audience: "homeapp.ddns.net",
                claims: claims,
                expires: expiration,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SIGNING_KEY"))),
                    SecurityAlgorithms.HmacSha256)
            );

            // Generate the JWT token as a string
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        private bool ValidateRefreshToken(JwtSecurityToken refreshToken)
        {
            // Check if the token is not expired, not revoked, and associated with a valid user
            // TODO: query your storage mechanism for refresh tokens

            // Currently only checks if the refresh token is valid and creates an access token based off the data of the refresh token

            // Check if the refresh token is not expired
            if (refreshToken == null || refreshToken.ValidTo < DateTime.UtcNow || refreshToken.Issuer != "homeapp.ddns.net")
            {
                return false;
            }

            return true;
        }

    }
}

