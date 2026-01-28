using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;
using Vastin.Service;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Vastin.Controller;

[Produces("application/json")]
[Consumes("application/json")]
[ApiController]
public class VideoController : ControllerBase
{
    private readonly VastinDbContext _context;
    private readonly VideoStream _videoStream;

    public VideoController(VastinDbContext context, VideoStream videoStream)
    {
        _context = context;
        _videoStream = videoStream;
    }

    [HttpGet("/video")]
    public async Task<IActionResult> GetVideos()
    {
        var videos = await _context.Videos
            .Where(v => v.Visibility == VideoVisibility.Public)
            .Include(v => v.Owner)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
            
        var videoDtos = videos.Select(v => new 
        {
            v.Id,
            v.Title,
            v.Description,
            v.ThumbnailPath,
            v.VideoPath,
            v.Length,
            v.Visibility,
            v.CreatedAt,
            Owner = new { v.Owner.Id, v.Owner.Username }
        });
        
        return Ok(videoDtos);
    }

    [HttpGet("/video/metadata/{id}")]
    public async Task<IActionResult> GetVideo([FromRoute] int id)
    {
        try
        {
            var video = await _context.Videos
                .Include(v => v.Owner)
                .FirstOrDefaultAsync(v => v.Id == id);
                
            if (video == null)
                return NotFound();

            var response = new 
            {
                video.Id,
                video.Title,
                video.Description,
                video.ThumbnailPath,
                video.VideoPath,
                video.Length,
                video.Visibility,
                video.CreatedAt,
                Owner = new { video.Owner.Id, video.Owner.Username }
            };

            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch("/video/{id}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateVideo(
        [FromRoute] int id,
        [FromForm] VideoDTO videoDto)
    {
        try
        {
            var username = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
            
            var videoToUpdate = await _context.Videos
                .Include(v => v.Owner)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (videoToUpdate == null)
                return NotFound();

            if (videoToUpdate.Owner.Username != username)
                return Forbid();

            videoToUpdate.Title = videoDto.Title ?? videoToUpdate.Title;
            videoToUpdate.Description = videoDto.Description ?? videoToUpdate.Description;
            videoToUpdate.ThumbnailPath = videoDto.ThumbnailPath ?? videoToUpdate.ThumbnailPath;
            videoToUpdate.Visibility = videoDto.Visibility; 

            
            if (videoDto.File != null && videoDto.File.Length > 0)
            {
                var newFileName = await _videoStream.ReplaceVideoAsync(videoToUpdate.VideoPath, videoDto.File);
                videoToUpdate.VideoPath = newFileName;
            }

            _context.Videos.Update(videoToUpdate);
            await _context.SaveChangesAsync();

            return Ok(videoToUpdate);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("/video/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteVideo([FromRoute] int id)
    {
        try
        {
            var username = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
            
            var video = await _context.Videos
                .Include(v => v.Owner)
                .FirstOrDefaultAsync(v => v.Id == id);
                
            if (video == null) return NotFound();

            if (video.Owner.Username != username)
                return Forbid();

            await _videoStream.DeleteVideoAsync(video.VideoPath);

            _context.Videos.Remove(video);
            
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("video/{id}")]
    public async Task StreamVideo(int id)
    {
        
        var video = await _context.Videos.FindAsync(id);
        if (video == null)
        {
            Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        await _videoStream.StreamVideoAsync(Response, video.VideoPath);
    }

    [HttpPost("upload")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadVideo([FromForm] VideoDTO videoUpload)
    {
        try
        {
            var username = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Name)?.Value;
            
            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            if (videoUpload.File == null || videoUpload.File.Length == 0)
                return BadRequest("No video file provided");

            var fileName = await _videoStream.SaveVideoAsync(videoUpload.File);
            
            var videoOwner = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (videoOwner == null)
                return BadRequest("Owner not found");

            var video = new Video
            {
                Title = videoUpload.Title,
                Description = videoUpload.Description,
                VideoPath = fileName,
                Length = videoUpload.Length,
                ThumbnailPath = videoUpload.ThumbnailPath,
                Visibility = videoUpload.Visibility,
                Owner = videoOwner,
                CreatedAt = DateTime.UtcNow 
            };

            _context.Videos.Add(video);
            await _context.SaveChangesAsync();

            return Ok(new 
            {
                video.Id,
                video.Title,
                video.Description,
                video.VideoPath,
                video.ThumbnailPath,
                Owner = new { videoOwner.Username }
            });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}