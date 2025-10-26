using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MyShorten.Core.Entities;
using MyShorten.Infrastructure.Data;
using MyShorten.Infrastructure.Repositories;
using MyShorten.Tests.Infrastructure;

namespace MyShorten.Tests.Unit.Repositories;

public class UrlRepositoryTests : IDisposable
{
  private readonly AppDbContext _context;
  private readonly UrlRepository _repository;
  private readonly User _testUser;

  public UrlRepositoryTests()
  {
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;

    _context = new AppDbContext(options);
    _repository = new UrlRepository(_context);

    _testUser = TestDataHelper.CreateTestUser();
    _context.Users.Add(_testUser);
    _context.SaveChanges();
  }

  [Fact]
  public async Task CreateAsync_ShouldCreateUrl()
  {
    var url = TestDataHelper.CreateTestUrl(_testUser.Id, "TEST01");

    var urlId = await _repository.CreateAsync(url);

    urlId.Should().BeGreaterThan(0);

    var createdUrl = await _context.ShortenedUrls.FindAsync(urlId);
    createdUrl.Should().NotBeNull();
    createdUrl!.Code.Should().Be("TEST01");
    createdUrl.UserId.Should().Be(_testUser.Id);
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnUrl_WhenUrlExists()
  {
    var url = TestDataHelper.CreateTestUrl(_testUser.Id);
    await _context.ShortenedUrls.AddAsync(url);
    await _context.SaveChangesAsync();

    var result = await _repository.GetByIdAsync(url.Id);

    result.Should().NotBeNull();
    result!.Id.Should().Be(url.Id);
    result.Code.Should().Be(url.Code);
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnNull_WhenUrlDoesNotExist()
  {
    var result = await _repository.GetByIdAsync(999);

    result.Should().BeNull();
  }

  [Fact]
  public async Task GetByCodeAsync_ShouldReturnUrl_WhenCodeExists()
  {
    var url = TestDataHelper.CreateTestUrl(_testUser.Id, "UNIQUE1");
    await _context.ShortenedUrls.AddAsync(url);
    await _context.SaveChangesAsync();

    var result = await _repository.GetByCodeAsync("UNIQUE1");

    result.Should().NotBeNull();
    result!.Code.Should().Be("UNIQUE1");
  }

  [Fact]
  public async Task GetByCodeAsync_ShouldReturnNull_WhenCodeDoesNotExist()
  {
    var result = await _repository.GetByCodeAsync("NOTFOUND");

    result.Should().BeNull();
  }

  [Fact]
  public async Task GetAllByUserIdAsync_ShouldReturnPaginatedUrls()
  {
    for (int i = 1; i <= 5; i++)
    {
      var url = TestDataHelper.CreateTestUrl(_testUser.Id, $"CODE{i}", $"https://example.com/{i}");
      await _context.ShortenedUrls.AddAsync(url);
    }
    await _context.SaveChangesAsync();

    var result = await _repository.GetAllByUserIdAsync(_testUser.Id, 1, 3, "id", "asc");

    result.urls.Should().HaveCount(3);
    result.totalCount.Should().Be(5);
  }

  [Fact]
  public async Task GetAllByUserIdAsync_ShouldReturnOnlyUserUrls()
  {
    var otherUser = TestDataHelper.CreateTestUser("other@test.com", "Other User");
    await _context.Users.AddAsync(otherUser);
    await _context.SaveChangesAsync();

    await _context.ShortenedUrls.AddAsync(TestDataHelper.CreateTestUrl(_testUser.Id, "USER1"));
    await _context.ShortenedUrls.AddAsync(TestDataHelper.CreateTestUrl(otherUser.Id, "USER2"));
    await _context.SaveChangesAsync();

    var result = await _repository.GetAllByUserIdAsync(_testUser.Id, 1, 10, "id", "asc");

    result.urls.Should().HaveCount(1);
    result.urls.First().UserId.Should().Be(_testUser.Id);
  }

  [Fact]
  public async Task GetAllByUserIdAsync_ShouldSortCorrectly()
  {
    await _context.ShortenedUrls.AddAsync(TestDataHelper.CreateTestUrl(_testUser.Id, "AAA", "https://zzz.com"));
    await _context.ShortenedUrls.AddAsync(TestDataHelper.CreateTestUrl(_testUser.Id, "ZZZ", "https://aaa.com"));
    await _context.SaveChangesAsync();

    var resultAsc = await _repository.GetAllByUserIdAsync(_testUser.Id, 1, 10, "original", "asc");
    resultAsc.urls.First().Original.Should().Be("https://aaa.com");

    var resultDesc = await _repository.GetAllByUserIdAsync(_testUser.Id, 1, 10, "original", "desc");
    resultDesc.urls.First().Original.Should().Be("https://zzz.com");
  }

  [Fact]
  public async Task DeleteAsync_ShouldRemoveUrl()
  {
    var url = TestDataHelper.CreateTestUrl(_testUser.Id);
    await _context.ShortenedUrls.AddAsync(url);
    await _context.SaveChangesAsync();

    await _repository.DeleteAsync(url.Id);

    var result = await _context.ShortenedUrls.FindAsync(url.Id);
    result.Should().BeNull();
  }

  public void Dispose()
  {
    _context.Database.EnsureDeleted();
    _context.Dispose();
  }
}
