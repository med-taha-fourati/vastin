using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vastin.DTO;
using Vastin.Models;
using Vastin.Service;

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
    public IActionResult GetVideos()
    {
        var videos = _context.Videos.ToList();
        return Ok(videos);
    }

    [HttpGet("/video/metadata/{id}")]
    public IActionResult GetVideo([FromRoute] int id)
    {
        try
        {
            var video = _context.Videos.Find(id);
            if (video == null)
                return NotFound();

            return Ok(video);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPatch("/video/{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateVideo(
        [FromRoute] int id,
        [FromForm] VideoDTO videoDto)
    {
        try
        {
            var videoToUpdate = _context.Videos.Find(id);
            if (videoToUpdate == null)
                return NotFound();

            videoToUpdate.Title = videoDto.Title;
            videoToUpdate.Description = videoDto.Description;
            videoToUpdate.ThumbnailPath = videoDto.ThumbnailPath;

            if (videoDto?.Owner != null)
            {
                var newOwner = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == videoDto.Owner.Username);
                
                if (newOwner != null)
                {
                    videoToUpdate.Owner = newOwner;
                }
            }

            if (videoDto?.File != null && videoDto.File.Length > 0)
            {
                var oldVideoPath = videoToUpdate.VideoPath;
                var newFileName = await _videoStream.SaveVideoAsync(videoDto.File);
                videoToUpdate.VideoPath = newFileName;
                
                await _videoStream.DeleteVideoAsync(oldVideoPath);
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
    public async Task<IActionResult> DeleteVideo([FromRoute] int id)
    {
        try
        {
            var video = _context.Videos.Find(id);
            if (video == null) return NotFound();

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
        var video = _context.Videos.Find(id);
        if (video == null)
        {
            Response.StatusCode = StatusCodes.Status404NotFound;
            return;
        }

        await _videoStream.StreamVideoAsync(Response, video.VideoPath);
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadVideo([FromForm] VideoDTO videoUpload)
    {
        try
        {
            if (videoUpload?.File == null || videoUpload.File.Length == 0)
                return BadRequest("No video file provided");

            var fileName = await _videoStream.SaveVideoAsync(videoUpload.File);
            
            var videoOwner = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == videoUpload.Owner.Username);

            if (videoOwner == null)
                return BadRequest("Owner not found");

            var video = new Video
            {
                Title = videoUpload.Title,
                Description = videoUpload.Description,
                VideoPath = fileName,
                Length = videoUpload.Length,
                ThumbnailPath = videoUpload.ThumbnailPath,
                Owner = videoOwner,
            };

            _context.Videos.Add(video);
            await _context.SaveChangesAsync();

            return Ok(video);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
}