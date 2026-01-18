using System.Security.Claims;

namespace Sell.Ge.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) return 0;
            return int.TryParse(claim.Value, out var id) ? id : 0;
        }
    }
}
