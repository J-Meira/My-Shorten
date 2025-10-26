using MyShorten.Core.Entities;

namespace MyShorten.Tests.Infrastructure;

public static class TestDataHelper
{
  public static User CreateTestUser(string email = "test@test.com", string name = "Test User")
  {
    return new User
    {
      Email = email,
      Name = name,
      Password = BCrypt.Net.BCrypt.HashPassword("Password123!", 12)
    };
  }

  public static ShortenedUrl CreateTestUrl(long userId, string code = "ABC123", string original = "https://example.com")
  {
    return new ShortenedUrl
    {
      UserId = userId,
      Code = code,
      Original = original
    };
  }
}
