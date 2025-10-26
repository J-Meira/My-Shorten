using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyShorten.Core.DTOs;
using MyShorten.Core.Entities;
using MyShorten.Core.Interfaces;

namespace MyShorten.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UrlsController(
    IUrlRepository urlRepository,
    ILogger<UrlsController> logger) : ControllerBase
{
  private readonly IUrlRepository _urlRepository = urlRepository;
  private readonly ILogger<UrlsController> _logger = logger;

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<UrlDto>> Create([FromBody] CreateUrlRequest request)
  {
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userIdClaim is null || !long.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized(new { message = "invalid token" });
    }

    var code = GenerateRandomCode();

    var shortenedUrl = new ShortenedUrl
    {
      Code = code,
      Original = request.Url,
      UserId = userId
    };

    var id = await _urlRepository.CreateAsync(shortenedUrl);

    var result = new UrlDto(id, code, request.Url, userId);

    return CreatedAtAction(nameof(GetById), new { id }, result);
  }

  [Authorize]
  [HttpGet]
  public async Task<ActionResult<UrlListResponse>> GetAll(
      [FromQuery] int page = 1,
      [FromQuery] int limit = 20,
      [FromQuery] string orderBy = "id",
      [FromQuery] string order = "asc")
  {
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userIdClaim is null || !long.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized(new { message = "invalid token" });
    }

    var (urls, totalCount) = await _urlRepository.GetAllByUserIdAsync(userId, page, limit, orderBy, order);

    var records = urls.Select(u => new UrlDto(u.Id, u.Code, u.Original, u.UserId)).ToList();

    return Ok(new UrlListResponse(records, totalCount));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<UrlDto>> GetById(long id)
  {
    var url = await _urlRepository.GetByIdAsync(id);

    if (url is null)
    {
      return NotFound(new { message = "Record Not Found" });
    }

    return Ok(new UrlDto(url.Id, url.Code, url.Original, url.UserId));
  }

  [HttpGet("code/{code}")]
  public async Task<ActionResult<UrlDto>> GetByCode(string code)
  {
    var url = await _urlRepository.GetByCodeAsync(code);

    if (url is null)
    {
      return NotFound(new { message = "Record Not Found" });
    }

    return Ok(new UrlDto(url.Id, url.Code, url.Original, url.UserId));
  }

  [Authorize]
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteById(long id)
  {
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userIdClaim is null || !long.TryParse(userIdClaim, out var userId))
    {
      return Unauthorized(new { message = "invalid token" });
    }

    var url = await _urlRepository.GetByIdAsync(id);

    if (url is null)
    {
      return NotFound(new { message = "Record Not Found" });
    }

    if (url.UserId != userId)
    {
      return BadRequest(new { message = "Url invalid" });
    }

    await _urlRepository.DeleteAsync(id);

    return NoContent();
  }

  private static string GenerateRandomCode()
  {
    const string mask = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var random = new Random();
    var code = new char[6];

    for (int i = 0; i < 6; i++)
    {
      code[i] = mask[random.Next(mask.Length)];
    }

    return new string(code);
  }
}
