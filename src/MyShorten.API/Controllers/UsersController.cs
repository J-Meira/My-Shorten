using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyShorten.Core.DTOs;
using MyShorten.Core.Entities;
using MyShorten.Core.Interfaces;

namespace MyShorten.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(
    IUserRepository userRepository,
    IConfiguration configuration,
    ILogger<UsersController> logger) : ControllerBase
{
  private readonly IUserRepository _userRepository = userRepository;
  private readonly IConfiguration _configuration = configuration;
  private readonly ILogger<UsersController> _logger = logger;

  [HttpPost("sign-up")]
  public async Task<ActionResult<UserDto>> SignUp([FromBody] SignUpRequest request)
  {
    if (await _userRepository.EmailExistsAsync(request.Email))
    {
      return BadRequest(new { message = "Email has already been registered" });
    }

    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

    var user = new User
    {
      Name = request.Name,
      Email = request.Email,
      Password = hashedPassword
    };

    var userId = await _userRepository.CreateAsync(user);

    var userDto = new UserDto(userId, user.Name, user.Email);

    return CreatedAtAction(nameof(SignUp), new { id = userId }, userDto);
  }

  [HttpPost("sign-in")]
  public async Task<ActionResult<SignInResponse>> SignIn([FromBody] SignInRequest request)
  {
    var user = await _userRepository.GetByEmailAsync(request.Email);

    if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
    {
      return BadRequest(new { message = "email or password are not valid" });
    }

    var secret = _configuration["JwtSettings:Secret"];
    if (string.IsNullOrEmpty(secret))
    {
      _logger.LogError("JWT Secret is not configured");
      return StatusCode(500, new { message = "Internal server error" });
    }

    var expiresIn = DateTime.UtcNow.AddHours(24);
    var token = GenerateJwtToken(user, secret);

    return Ok(new SignInResponse(
        token,
        expiresIn,
        new UserDto(user.Id, user.Name, user.Email)
    ));
  }

  private string GenerateJwtToken(User user, string secret)
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(secret);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[]
        {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            }),
      Expires = DateTime.UtcNow.AddHours(24),
      SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
  }
}
