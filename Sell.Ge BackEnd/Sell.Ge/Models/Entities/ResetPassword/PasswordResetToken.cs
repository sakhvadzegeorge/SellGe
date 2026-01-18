namespace Sell.Ge.Models.Entities.ResetPassword
{
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string TokenHash { get; set; }
        public DateTime ExpiresAtUtc { get; set; }
        public bool IsUsed { get; set; }

        public User User { get; set; }
    }
}
