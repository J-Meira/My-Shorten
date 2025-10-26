namespace MyShorten.API.Helpers;

public static class HostingHelpers
{
  public static void MakeStaticEnvFile(IConfiguration configuration, ILogger? logger = null)
  {
    try
    {
      var clientUrl = configuration["ClientUrl"];

      if (string.IsNullOrEmpty(clientUrl))
      {
        logger?.LogWarning("ClientUrl is not configured in appsettings.json");
        return;
      }

      var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

      if (!Directory.Exists(wwwrootPath))
      {
        logger?.LogInformation("Creating wwwroot directory...");
        Directory.CreateDirectory(wwwrootPath);
      }

      var envFilePath = Path.Combine(wwwrootPath, "env.static.js");
      var content = $"window.__ENV__ = {{ url: \"{clientUrl}\" }};";

      File.WriteAllText(envFilePath, content);
      logger?.LogInformation("Static environment file created at: {Path}", envFilePath);
    }
    catch (Exception ex)
    {
      logger?.LogError(ex, "Failed to create static environment file");
      throw;
    }
  }
}
