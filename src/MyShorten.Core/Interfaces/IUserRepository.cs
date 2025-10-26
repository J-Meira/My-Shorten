using MyShorten.Core.Entities;

namespace MyShorten.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(long id);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task<long> CreateAsync(User user);
}
