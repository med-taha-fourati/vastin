using Microsoft.AspNetCore.Http;
using Vastin.Models;

namespace Vastin.DTO;

public class VideoDTO
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Length { get; set; } = 0;
    
    public IFormFile File { get; set; } = default!;
    public string VideoPath { get; set; } = string.Empty;
    public string ThumbnailPath { get; set; } = string.Empty;
    public VideoVisibility Visibility { get; set; } = VideoVisibility.Public;
    public UserDTO Owner { get; set; }
}