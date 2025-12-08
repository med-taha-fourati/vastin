using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;

namespace Vastin.Controller;

[Produces("application/json")]
[Consumes("application/json")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly VastinDbContext _context;
    
    public UserController(VastinDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("/user")]
    public IActionResult GetUser()
    {
        var users = _context.Users.ToList();
        return Ok(users);
    }

    [HttpPost("/user/register")]
    public IActionResult RegisterUser([FromBody] User user)
    {
        try
        {
            var result = _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(result.Entity);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("/user/login")]
    public IActionResult Login([FromBody] UserDTO user)
    {
        try
        {
            var result = _context.Users.FirstOrDefault(x =>
                x.Username == user.Username && x.Password == user.Password);
            return Ok(result);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("/user/{id}")]
    public IActionResult UpdateUser([FromRoute] int id)
    {
        try
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch("/user/{id}")]
    public IActionResult UpdateUser([FromRoute] int id, [FromBody] UserDTO user)
    {
        try
        {
            var userToUpdate = _context.Users.Find(id);
            if (userToUpdate == null) return NotFound();
            userToUpdate.Username = user.Username;
            userToUpdate.Password = user.Password;
            _context.Users.Update(userToUpdate);
            _context.SaveChanges();

            return Ok(userToUpdate);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/user/{id}")]
    public IActionResult DeleteUser([FromRoute] int id)
    {
        try
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    
}