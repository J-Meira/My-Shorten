using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using MyShorten.Infrastructure.Data;

namespace MyShorten.Tests.Infrastructure;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
  private readonly string _databaseName = $"TestDatabase_{Guid.NewGuid()}";

  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.UseEnvironment("Testing");

    builder.ConfigureAppConfiguration((context, config) =>
    {
      config.AddInMemoryCollection(new Dictionary<string, string?>
      {
        ["JwtSettings:Secret"] = "ThisIsATestSecretKeyForJWTAuthenticationTesting123456789",
        ["JwtSettings:ExpiresInMinutes"] = "60"
      });
    });

    builder.ConfigureServices(services =>
    {
      // Remove all DbContext-related descriptors
      var dbContextDescriptors = services
        .Where(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                    d.ServiceType == typeof(AppDbContext) ||
                    d.ServiceType == typeof(DbContextOptions))
        .ToList();

      foreach (var descriptor in dbContextDescriptors)
      {
        services.Remove(descriptor);
      }

      // Use a unique database per factory instance (per test class)
      services.AddDbContext<AppDbContext>(options =>
      {
        options.UseInMemoryDatabase(_databaseName);
      });
    });
  }
}
