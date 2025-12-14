namespace Vastin.DTO;

public class CommentDTO
{
    public string Content { get; set; }
    public UserDTO CommentOwner { get; set; }
    public VideoDTO VideoOwner { get; set; }
}