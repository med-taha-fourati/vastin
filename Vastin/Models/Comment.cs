using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vastin.Models;

public class Comment
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Content { get; set; }
    
    [Required]
    [ForeignKey("User_Comment")]
    public int CommentOwner { get; set; }
    
    [Required]
    [ForeignKey("Video_Comment")]
    public int VideoOwner { get; set; }
}