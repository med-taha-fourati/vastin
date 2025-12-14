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
    public IActionResult GetComments()
    {
        var comments = _context.Comments
            .Include(c => c.CommentOwner)
            .Include(c => c.VideoOwner)
            .ToList();

        return Ok(comments);
    }

    [HttpGet("{id}")]
    public IActionResult GetComment(int id)
    {
        var comment = _context.Comments
            .Include(c => c.CommentOwner)
            .Include(c => c.VideoOwner)
            .FirstOrDefault(c => c.Id == id);

        if (comment == null)
            return NotFound();

        return Ok(comment);
    }

    [HttpGet("video/{videoId}")]
    public IActionResult GetCommentsByVideo(int videoId)
    {
        var comments = _context.Comments
            .Include(c => c.CommentOwner)
            .Include(c => c.VideoOwner)
            .Where(c => c.VideoOwner.Id == videoId)
            .ToList();

        return Ok(comments);
    }

    [HttpPost("add")]
    public IActionResult AddComment(
        [FromBody] CommentDTO dto,
        [FromQuery] int userId,
        [FromQuery] int videoId
        )
    {
        try
        {
            var user = _context.Users.Find(userId);
            if (user == null)
                return BadRequest("Invalid user");

            var video = _context.Videos.Find(videoId);
            if (video == null)
                return BadRequest("Invalid video");

            var comment = new Comment
            {
                Content = dto.Content,
                CommentOwner = user,
                VideoOwner = video
            };

            _context.Comments.Add(comment);
            _context.SaveChanges();

            return Ok(comment);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch("{id}")]
    public IActionResult UpdateComment([FromRoute] int id, 
        [FromQuery] int userId,
        [FromQuery] int videoId,
        [FromBody] CommentDTO dto)
    {
        try
        {
            var comment = _context.Comments
                .Include(c => c.CommentOwner)
                .Include(c => c.VideoOwner)
                .FirstOrDefault(c => c.Id == id);

            if (comment == null)
                return NotFound();

            var user = _context.Users.Find(userId);
            if (user == null)
                return BadRequest("Invalid user");

            var video = _context.Videos.Find(videoId);
            if (video == null)
                return BadRequest("Invalid video");

            comment.Content = dto.Content;
            comment.CommentOwner = user;
            comment.VideoOwner = video;

            _context.SaveChanges();

            return Ok(comment);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteComment(int id)
    {
        var comment = _context.Comments.Find(id);
        if (comment == null)
            return NotFound();

        _context.Comments.Remove(comment);
        _context.SaveChanges();

        return Ok();
    }
}
