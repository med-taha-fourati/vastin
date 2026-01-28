using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;
using BCrypt.Net;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace Vastin.Controller;

[Produces("application/json")]
[Consumes("application/json")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly VastinDbContext _context;
    private readonly IConfiguration _configuration;
    
    public UserController(VastinDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
    [HttpGet("/user")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        var userDtos = users.Select(u => new UserResponseDTO 
        { 
            Id = u.Id, 
            Username = u.Username 
        }).ToList();
        return Ok(userDtos);
    }

    [HttpPost("/user/register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterRequestDTO dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);
            
            if (existingUser != null)
                return BadRequest("Username already exists");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            
            var user = new User
            {
                Username = dto.Username,
                Password = hashedPassword
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var response = new UserResponseDTO 
            { 
                Id = user.Id, 
                Username = user.Username 
            };
            
            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("/user/login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null)
                return Unauthorized("Invalid username or password");

            var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
            
            if (!isPasswordValid)
                return Unauthorized("Invalid username or password");

            var token = GenerateJwtToken(user);

            
            var response = new 
            { 
                Id = user.Id, 
                Username = user.Username,
                Token = token
            };
            
            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("/user/logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("/user/current")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var username = User.Identity?.Name; 
        
       if (string.IsNullOrEmpty(username))
             username = User.FindFirst(ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(username))
            return Unauthorized("Not logged in");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        
        if (user == null)
            return NotFound();

        var response = new UserResponseDTO 
        { 
            Id = user.Id, 
            Username = user.Username 
        };
        
        return Ok(response);
    }

    [HttpGet("/user/{id}")]
    public async Task<IActionResult> GetUserById([FromRoute] int id)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            
            var response = new UserResponseDTO 
            { 
                Id = user.Id, 
                Username = user.Username 
            };
            
            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("/user/profile/{username}")]
    public async Task<IActionResult> GetUserByUsername([FromRoute] string username)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
                
            if (user == null) return NotFound();
            
            var response = new UserResponseDTO 
            { 
                Id = user.Id, 
                Username = user.Username 
            };
            
            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/user/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser([FromRoute] int id)
    {
        try
        {
            
            var currentUsername = User.Identity?.Name;
            var userToDelete = await _context.Users.FindAsync(id);

            if (userToDelete == null) return NotFound();
            
            if (userToDelete.Username != currentUsername)
                 return Forbid("Cannot delete another user");

            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();
            
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim("id", user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}