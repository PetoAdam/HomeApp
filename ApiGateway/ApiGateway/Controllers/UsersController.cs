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

        [HttpGet("auth/google")]
        public async Task<RedirectResult> GoogleAuth(string code)
        {
            // Exchange the authorization code for a Google access token
            var googleClient = new GoogleClient();
            string accessToken = await googleClient.ExchangeTokenAsync(code);

            if (string.IsNullOrEmpty(accessToken))
            {
                return new RedirectResult("https://homeapp.ddns.net/profile");
            }

            // Get the user's Google profile
            var profile = await googleClient.GetProfileAsync(accessToken);
            if (profile == null)
            {
                return new RedirectResult("https://homeapp.ddns.net/profile");
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
            Response.Cookies.Append("token", token, cookieOptions);


            // Return the JWT token
            return new RedirectResult("http://homeapp.ddns.net/profile");
        }

        [HttpPost("auth/login")]
        public async Task<RedirectResult> Login([FromBody] Authentication.LoginInfo loginInfo)
        {

            if (string.IsNullOrEmpty(loginInfo.Email) || string.IsNullOrEmpty(loginInfo.Password))
            {
                return new RedirectResult("https://homeapp.ddns.net/profile");
            }

            // Check if the user exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == loginInfo.Email.ToUpper() && u.PasswordHash == Hasher.GetHashString(loginInfo.Password));
            if (user == null)
            {
                return new RedirectResult("https://homeapp.ddns.net/profile");
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
            Response.Cookies.Append("token", token, cookieOptions);


            // Return the JWT token
            return new RedirectResult("http://homeapp.ddns.net/profile");
        }

        [HttpPost("auth/signup")]
        public async Task<RedirectResult> Signup([FromBody] Authentication.LoginInfo loginInfo)
        {

            if (string.IsNullOrEmpty(loginInfo.Email) || string.IsNullOrEmpty(loginInfo.Password) || string.IsNullOrEmpty(loginInfo.Username))
            {
                return new RedirectResult("https://homeapp.ddns.net/profile");
            }

            // Check if the user exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == loginInfo.Email.ToUpper());
            if (user != null)
            {
                return new RedirectResult("https://homeapp.ddns.net/profile");
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
            Response.Cookies.Append("token", token, cookieOptions);


            // Return the JWT token
            return new RedirectResult("http://homeapp.ddns.net/profile");
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<Dal.IdentityUser> Info(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        private string CreateToken(Profile profile, IEnumerable<string> roles)
        {
            // Create a list of custom claims
            var claims = new List<Claim>
            {
                new Claim("user_id", profile.Id),
                new Claim("name", profile.Name),
                new Claim("email", profile.Email),
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Create the JWT token
            var jwtToken = new JwtSecurityToken(
                issuer: "homeapp.ddns.net",
                audience: "homeapp.ddns.net",
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SIGNING_KEY"))), SecurityAlgorithms.HmacSha256)
            );

            // Generate the JWT token as a string
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

    }
}

