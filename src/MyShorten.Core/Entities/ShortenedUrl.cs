namespace MyShorten.Core.Entities;

public class ShortenedUrl
{
    public long Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Original { get; set; } = string.Empty;
    public long UserId { get; set; }

    public User User { get; set; } = null!;
}
