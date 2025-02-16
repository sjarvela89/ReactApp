using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }  // Store hashed password
    }
}