using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vastin.Models;

public class Comment
{
    [Key]
    public string Id { get; set; }
    
    [Required]
    public string Content { get; set; }
    
    [Required]
    [ForeignKey("User_Comment")]
    public string CommentOwner { get; set; }
    
    [Required]
    [ForeignKey("User_Video")]
    public string VideoOwner { get; set; }
}