using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vastin.Models;

public class Video
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Title { get; set; }
    
    public string Description { get; set; }
    [Required]
    public int Length { get; set; }
    
     [Required]
    public string VideoPath { get; set; }
    public string ThumbnailPath { get; set; }
    
    [ForeignKey("User_Video")]
    public User Owner { get; set; }
    
    public int OwnerId { get; set; }
}