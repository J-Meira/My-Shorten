using MyShorten.API.Configuration;
using MyShorten.API.Helpers;
using MyShorten.API.Middleware;
using MyShorten.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Skip database registration in Testing environment - will be added by WebApplicationFactory
var skipDatabase = builder.Environment.EnvironmentName == "Testing";
builder.Services.AddApplicationServices(builder.Configuration, skipDatabase);

var app = builder.Build();

if (app.Environment.EnvironmentName != "Testing")
{
  await DbInitializer.InitializeAsync(app.Services, app.Environment);
  HostingHelpers.MakeStaticEnvFile(app.Configuration, app.Logger);
}

if (app.Environment.EnvironmentName != "Testing")
{
  app.UseSwagger();
  app.UseSwaggerUI(options =>
  {
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MyShorten API v1");
    options.RoutePrefix = "swagger";
  });
}

app.UseGlobalExceptionHandler();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.EnvironmentName != "Testing")
{
  app.UseStaticFiles();

  app.MapFallback(async context =>
  {
    if (context.Request.Path.StartsWithSegments("/api") ||
        context.Request.Path.StartsWithSegments("/swagger"))
    {
      context.Response.StatusCode = 404;
      await context.Response.WriteAsJsonAsync(new
      {
        status = 404,
        title = "Not Found",
        detail = $"The requested endpoint '{context.Request.Path}' was not found."
      });
      return;
    }

    await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "index.html"));
  });
}

app.Run();

public partial class Program { }
