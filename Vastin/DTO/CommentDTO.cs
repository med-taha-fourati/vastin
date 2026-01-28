using System.ComponentModel.DataAnnotations;

namespace Vastin.DTO;

public class CommentDTO
{
    [Required]
    [MinLength(1)]
    public string Content { get; set; }
}

public class CommentResponseDTO
{
    public int Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public UserResponseDTO CommentOwner { get; set; }
    public int VideoOwnerId { get; set; }
}