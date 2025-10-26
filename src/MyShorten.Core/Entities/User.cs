namespace MyShorten.Core.Entities;

public class User
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public ICollection<ShortenedUrl> ShortenedUrls { get; set; } = new List<ShortenedUrl>();
}
