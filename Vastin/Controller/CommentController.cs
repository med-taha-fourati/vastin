using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;

namespace Vastin.Controller;

[ApiController]
[Route("comment")]
[Produces("application/json")]
[Consumes("application/json")]
public class CommentController : ControllerBase
{
    private readonly VastinDbContext _context;

    public CommentController(VastinDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetComments()
    {
        var comments = await _context.Comments
            .Include(c => c.CommentOwner)
            .Include(c => c.VideoOwner)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var response = comments.Select(c => new CommentResponseDTO
        {
            Id = c.Id,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            CommentOwner = new UserResponseDTO
            {
                Id = c.CommentOwner.Id,
                Username = c.CommentOwner.Username
            },
            VideoOwnerId = c.VideoOwnerId
        }).ToList();

        return Ok(response);
    }

    [HttpGet("video/{videoId}")]
    public async Task<IActionResult> GetCommentsByVideo(int videoId)
    {
        var comments = await _context.Comments
            .Include(c => c.CommentOwner)
            .Where(c => c.VideoOwnerId == videoId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var response = comments.Select(c => new CommentResponseDTO
        {
            Id = c.Id,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            CommentOwner = new UserResponseDTO
            {
                Id = c.CommentOwner.Id,
                Username = c.CommentOwner.Username
            },
            VideoOwnerId = c.VideoOwnerId
        }).ToList();

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddComment(
        [FromBody] CommentDTO dto,
        [FromQuery] int videoId
    )
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var usernameClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (usernameClaim == null)
            return Unauthorized();
    
        var username = usernameClaim.Value;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return BadRequest("Invalid user");

        var video = await _context.Videos.FindAsync(videoId);
        if (video == null)
            return BadRequest("Invalid video");

        var comment = new Comment
        {
            Content = dto.Content,
            CommentOwnerId = user.Id,
            VideoOwnerId = video.Id
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(new CommentResponseDTO
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            CommentOwner = new UserResponseDTO
            {
                Id = user.Id,
                Username = user.Username
            },
            VideoOwnerId = video.Id
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        try
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Unauthorized("You must be logged in to delete comments");

            var comment = await _context.Comments
                .Include(c => c.CommentOwner)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
                return NotFound();

            if (comment.CommentOwnerId != userId.Value)
                return Forbid("You can only delete your own comments");

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment deleted successfully" });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}
