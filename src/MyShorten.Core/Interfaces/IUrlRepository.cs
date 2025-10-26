using MyShorten.Core.Entities;

namespace MyShorten.Core.Interfaces;

public interface IUrlRepository
{
    Task<ShortenedUrl?> GetByIdAsync(long id);
    Task<ShortenedUrl?> GetByCodeAsync(string code);
    Task<(List<ShortenedUrl> urls, int totalCount)> GetAllByUserIdAsync(
        long userId,
        int page = 1,
        int limit = 20,
        string orderBy = "id",
        string order = "asc"
    );
    Task<long> CreateAsync(ShortenedUrl url);
    Task DeleteAsync(long id);
}
