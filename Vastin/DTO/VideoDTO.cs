namespace Vastin.DTO;

public class VideoDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int Length { get; set; }
    public string VideoPath { get; set; }
    public string ThumbnailPath { get; set; }
    public int Owner { get; set; }
}