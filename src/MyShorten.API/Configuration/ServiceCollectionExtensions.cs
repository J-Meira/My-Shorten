using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using MyShorten.Core.Interfaces;
using MyShorten.Core.Validators;
using MyShorten.Infrastructure.Data;
using MyShorten.Infrastructure.Repositories;

namespace MyShorten.API.Configuration;

public static class ServiceCollectionExtensions
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration, bool skipDatabase = false)
  {
    if (!skipDatabase)
    {
      services.AddDbContext<AppDbContext>(options =>
          options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    }

    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IUrlRepository, UrlRepository>();

    services.AddFluentValidationAutoValidation();
    services.AddValidatorsFromAssemblyContaining<SignUpRequestValidator>();

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          var secret = configuration["JwtSettings:Secret"];
          if (string.IsNullOrEmpty(secret))
          {
            throw new InvalidOperationException("JWT Secret is not configured");
          }

          options.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
          };
        });

    services.AddAuthorization();

    services.AddCors(options =>
    {
      options.AddDefaultPolicy(builder =>
      {
        var allowedOrigins = configuration["AllowedOrigins"] ?? "http://localhost:3005";
        var origins = allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        builder.WithOrigins(origins)
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
      });
    });

    services.AddSwaggerGen(options =>
    {
      options.SwaggerDoc("v1", new OpenApiInfo
      {
        Title = "MyShorten API",
        Version = "v1",
        Description = "URL Shortener API built with ASP.NET Core 9.0"
      });

      options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
      {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
      });

      options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
        });
    });

    return services;
  }

}
