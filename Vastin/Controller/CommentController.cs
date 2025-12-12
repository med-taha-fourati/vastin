using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;

namespace Vastin.Controller;

[Produces("application/json")]
[Consumes("application/json")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly VastinDbContext _context;
    
    public CommentController(VastinDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("/comment")]
    public IActionResult GetComments()
    {
        var comments = _context.Comments.ToList();
        return Ok(comments);
    }
    
    [HttpGet("/comment/{id}")]
    public IActionResult GetComment([FromRoute] int id)
    {
        try
        {
            var comment = _context.Comments.Find(id);
            if (comment == null) return NotFound();
            return Ok(comment);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("/comment/video/{videoId}")]
    public IActionResult GetCommentsByVideo([FromRoute] int videoId)
    {
        try
        {
            var comments = _context.Comments
                .Where(c => c.VideoOwner == videoId)
                .ToList();
            return Ok(comments);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("/comment/add")]
    public IActionResult AddComment([FromBody] Comment comment)
    {
        try
        {
            var result = _context.Comments.Add(comment);
            _context.SaveChanges();
            return Ok(result.Entity);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch("/comment/{id}")]
    public IActionResult UpdateComment([FromRoute] int id, [FromBody] CommentDTO commentDto)
    {
        try
        {
            var commentToUpdate = _context.Comments.Find(id);
            if (commentToUpdate == null) return NotFound();
            
            commentToUpdate.Content = commentDto.Content;
            commentToUpdate.CommentOwner = commentDto.CommentOwner;
            commentToUpdate.VideoOwner = commentDto.VideoOwner;
            
            _context.Comments.Update(commentToUpdate);
            _context.SaveChanges();

            return Ok(commentToUpdate);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/comment/{id}")]
    public IActionResult DeleteComment([FromRoute] int id)
    {
        try
        {
            var comment = _context.Comments.Find(id);
            if (comment == null) return NotFound();
            
            _context.Comments.Remove(comment);
            _context.SaveChanges();
            
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}