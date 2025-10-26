using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MyShorten.Core.Entities;

namespace MyShorten.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider, IHostEnvironment environment)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            logger.LogInformation("Checking for pending migrations...");
            
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            if (pendingMigrations.Any())
            {
                logger.LogInformation("Applying {Count} pending migration(s)...", pendingMigrations.Count());
                await context.Database.MigrateAsync();
                logger.LogInformation("Migrations applied successfully");
            }
            else
            {
                logger.LogInformation("No pending migrations found");
            }

            if (environment.IsDevelopment())
            {
                await SeedDevelopmentDataAsync(context, logger);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing the database");
            throw;
        }
    }

    private static async Task SeedDevelopmentDataAsync(AppDbContext context, ILogger logger)
    {
        if (await context.Users.AnyAsync())
        {
            logger.LogInformation("Database already contains data, skipping seed");
            return;
        }

        logger.LogInformation("Seeding development data...");

        var users = new List<User>
        {
            new()
            {
                Name = "John Doe",
                Email = "john@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Password123")
            },
            new()
            {
                Name = "Jane Smith",
                Email = "jane@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Password123")
            },
            new()
            {
                Name = "Bob Wilson",
                Email = "bob@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Password123")
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        var urls = new List<ShortenedUrl>
        {
            new()
            {
                Code = "abc123",
                Original = "https://github.com",
                UserId = users[0].Id
            },
            new()
            {
                Code = "def456",
                Original = "https://stackoverflow.com",
                UserId = users[0].Id
            },
            new()
            {
                Code = "ghi789",
                Original = "https://microsoft.com",
                UserId = users[1].Id
            },
            new()
            {
                Code = "jkl012",
                Original = "https://dotnet.microsoft.com",
                UserId = users[1].Id
            },
            new()
            {
                Code = "mno345",
                Original = "https://docs.microsoft.com",
                UserId = users[2].Id
            }
        };

        await context.ShortenedUrls.AddRangeAsync(urls);
        await context.SaveChangesAsync();

        logger.LogInformation("Development data seeded successfully");
        logger.LogInformation("Test users created with password: Password123");
    }
}
