                                                                                                                                                                                                                                                                                                                                                        using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vastin.Models;

public enum VideoVisibility
{
    Public,
    Private,
    Unlisted
}

public class Video
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    
    [MaxLength(2000)]
    public string Description { get; set; }
    
    [Required]
    public int Length { get; set; }
    
    [Required]
    public string VideoPath { get; set; }
    
    public string ThumbnailPath { get; set; }
    
    [Required]
    public VideoVisibility Visibility { get; set; } = VideoVisibility.Public;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("User_Video")]
    public User Owner { get; set; }
    
    public int OwnerId { get; set; }
}