using Sell.Ge.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace Sell.Ge.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        public int Age { get; set; }

        [Required]
        [MaxLength(256)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [MaxLength(500)]
        public string Address { get; set; }

        [MaxLength(20)]
        public string Phone { get; set; }

        [MaxLength(20)]
        public string ZipCode { get; set; }

        [MaxLength(500)]
        public string Avatar { get; set; }

        public Gender Gender { get; set; }

        public Role Role { get; set; } = Role.User;
    }
}
