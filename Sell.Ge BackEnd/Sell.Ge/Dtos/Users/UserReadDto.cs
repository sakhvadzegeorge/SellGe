using Sell.Ge.Models.Enums;

namespace Sell.Ge.Dtos.Users
{
    public class UserReadDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string ZipCode { get; set; }
        public string Avatar { get; set; }
        public Gender Gender { get; set; }
        public Role Role { get; set; }
    }
}
