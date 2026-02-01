using System.ComponentModel.DataAnnotations;

namespace Vastin.DTO;

public class RegisterRequestDTO
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    public string Username { get; set; }
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; }
}

public class LoginRequestDTO
{
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Password { get; set; }
}

public class UserResponseDTO
{
    public int Id { get; set; }
    public string Username { get; set; }
}
