using Microsoft.EntityFrameworkCore;
using MyShorten.Core.Entities;
using MyShorten.Core.Interfaces;
using MyShorten.Infrastructure.Data;

namespace MyShorten.Infrastructure.Repositories;

public class UrlRepository(AppDbContext context) : IUrlRepository
{
    private readonly AppDbContext _context = context;

    public async Task<ShortenedUrl?> GetByIdAsync(long id)
    {
        return await _context.ShortenedUrls
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<ShortenedUrl?> GetByCodeAsync(string code)
    {
        return await _context.ShortenedUrls
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Code == code);
    }

    public async Task<(List<ShortenedUrl> urls, int totalCount)> GetAllByUserIdAsync(
        long userId,
        int page = 1,
        int limit = 20,
        string orderBy = "id",
        string order = "asc")
    {
        var query = _context.ShortenedUrls
            .AsNoTracking()
            .Where(u => u.UserId == userId);

        var totalCount = await query.CountAsync();

        var orderedQuery = orderBy.ToLowerInvariant() switch
        {
            "code" => order.ToLowerInvariant() == "desc"
                ? query.OrderByDescending(u => u.Code)
                : query.OrderBy(u => u.Code),
            "original" => order.ToLowerInvariant() == "desc"
                ? query.OrderByDescending(u => u.Original)
                : query.OrderBy(u => u.Original),
            _ => order.ToLowerInvariant() == "desc"
                ? query.OrderByDescending(u => u.Id)
                : query.OrderBy(u => u.Id),
        };

        var urls = await orderedQuery
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return (urls, totalCount);
    }

    public async Task<long> CreateAsync(ShortenedUrl url)
    {
        _context.ShortenedUrls.Add(url);
        await _context.SaveChangesAsync();
        return url.Id;
    }

    public async Task DeleteAsync(long id)
    {
        await _context.ShortenedUrls
            .Where(u => u.Id == id)
            .ExecuteDeleteAsync();
    }
}
