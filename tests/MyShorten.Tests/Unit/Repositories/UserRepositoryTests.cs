using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MyShorten.Infrastructure.Data;
using MyShorten.Infrastructure.Repositories;
using MyShorten.Tests.Infrastructure;

namespace MyShorten.Tests.Unit.Repositories;

public class UserRepositoryTests : IDisposable
{
  private readonly AppDbContext _context;
  private readonly UserRepository _repository;

  public UserRepositoryTests()
  {
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
        .Options;

    _context = new AppDbContext(options);
    _repository = new UserRepository(_context);
  }

  [Fact]
  public async Task CreateAsync_ShouldCreateUser()
  {
    var user = TestDataHelper.CreateTestUser("newuser@test.com", "New User");

    var userId = await _repository.CreateAsync(user);

    userId.Should().BeGreaterThan(0);

    var createdUser = await _context.Users.FindAsync(userId);
    createdUser.Should().NotBeNull();
    createdUser!.Email.Should().Be("newuser@test.com");
    createdUser.Name.Should().Be("New User");
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnUser_WhenUserExists()
  {
    var user = TestDataHelper.CreateTestUser();
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    var result = await _repository.GetByIdAsync(user.Id);

    result.Should().NotBeNull();
    result!.Id.Should().Be(user.Id);
    result.Email.Should().Be(user.Email);
  }

  [Fact]
  public async Task GetByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
  {
    var result = await _repository.GetByIdAsync(999);

    result.Should().BeNull();
  }

  [Fact]
  public async Task GetByEmailAsync_ShouldReturnUser_WhenEmailExists()
  {
    var user = TestDataHelper.CreateTestUser("unique@test.com");
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    var result = await _repository.GetByEmailAsync("unique@test.com");

    result.Should().NotBeNull();
    result!.Email.Should().Be("unique@test.com");
  }

  [Fact]
  public async Task GetByEmailAsync_ShouldReturnNull_WhenEmailDoesNotExist()
  {
    var result = await _repository.GetByEmailAsync("nonexistent@test.com");

    result.Should().BeNull();
  }

  [Fact]
  public async Task EmailExistsAsync_ShouldReturnTrue_WhenEmailExists()
  {
    var user = TestDataHelper.CreateTestUser("exists@test.com");
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    var result = await _repository.EmailExistsAsync("exists@test.com");

    result.Should().BeTrue();
  }

  [Fact]
  public async Task EmailExistsAsync_ShouldReturnFalse_WhenEmailDoesNotExist()
  {
    var result = await _repository.EmailExistsAsync("notfound@test.com");

    result.Should().BeFalse();
  }

  public void Dispose()
  {
    _context.Database.EnsureDeleted();
    _context.Dispose();
  }
}
