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
    public User CommentOwner { get; set; }
    
    [Required]
    [ForeignKey("Video_Comment")]
    public Video VideoOwner { get; set; }
}