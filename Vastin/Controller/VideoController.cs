using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;

namespace Vastin.Controller;

[Produces("application/json")]
[Consumes("application/json")]
[ApiController]
public class VideoController : ControllerBase
{
    private readonly VastinDbContext _context;
    
    public VideoController(VastinDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("/video")]
    public IActionResult GetVideos()
    {
        var videos = _context.Videos.ToList();
        return Ok(videos);
    }
    
    [HttpGet("/video/{id}")]
    public IActionResult GetVideo([FromRoute] int id)
    {
        try
        {
            var video = _context.Videos.Find(id);
            if (video == null) return NotFound();
            return Ok(video);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("/video/add")]
    public IActionResult AddVideo([FromBody] Video video)
    {
        try
        {
            var result = _context.Videos.Add(video);
            _context.SaveChanges();
            return Ok(result.Entity);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch("/video/{id}")]
    public IActionResult UpdateVideo([FromRoute] int id, [FromBody] VideoDTO videoDto)
    {
        try
        {
            var videoToUpdate = _context.Videos.Find(id);
            if (videoToUpdate == null) return NotFound();
            
            videoToUpdate.Title = videoDto.Title;
            videoToUpdate.Description = videoDto.Description;
            videoToUpdate.Length = videoDto.Length;
            videoToUpdate.VideoPath = videoDto.VideoPath;
            videoToUpdate.ThumbnailPath = videoDto.ThumbnailPath;
            videoToUpdate.Owner = videoDto.Owner;
            
            _context.Videos.Update(videoToUpdate);
            _context.SaveChanges();

            return Ok(videoToUpdate);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/video/{id}")]
    public IActionResult DeleteVideo([FromRoute] int id)
    {
        try
        {
            var video = _context.Videos.Find(id);
            if (video == null) return NotFound();
            
            _context.Videos.Remove(video);
            _context.SaveChanges();
            
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}