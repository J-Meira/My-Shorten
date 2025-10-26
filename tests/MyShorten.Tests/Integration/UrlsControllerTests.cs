using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using MyShorten.Core.DTOs;
using MyShorten.Core.Entities;
using MyShorten.Infrastructure.Data;
using MyShorten.Tests.Infrastructure;

namespace MyShorten.Tests.Integration;

public class UrlsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
  private readonly HttpClient _client;
  private readonly CustomWebApplicationFactory _factory;

  public UrlsControllerTests(CustomWebApplicationFactory factory)
  {
    _factory = factory;
    _client = factory.CreateClient();
  }

  private async Task<string> GetAuthTokenAsync()
  {
    var email = $"authuser{Guid.NewGuid()}@test.com";
    var password = "Password123!";

    var signUpRequest = new SignUpRequest("Auth User", email, password);
    await _client.PostAsJsonAsync("/api/users/sign-up", signUpRequest);

    var signInRequest = new SignInRequest(email, password);
    var signInResponse = await _client.PostAsJsonAsync("/api/users/sign-in", signInRequest);
    var result = await signInResponse.Content.ReadFromJsonAsync<SignInResponse>();

    return result!.AccessToken;
  }

  private void SetAuthToken(string token)
  {
    _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
  }

  [Fact]
  public async Task CreateUrl_ShouldReturnCreated_WithValidData()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    var request = new CreateUrlRequest("https://example.com");
    var response = await _client.PostAsJsonAsync("/api/urls", request);

    response.StatusCode.Should().Be(HttpStatusCode.Created);

    var result = await response.Content.ReadFromJsonAsync<UrlDto>();
    result.Should().NotBeNull();
    result!.Original.Should().Be("https://example.com");
    result.Code.Should().NotBeNullOrEmpty();
    result.Code.Should().HaveLength(6);
  }

  [Fact]
  public async Task CreateUrl_ShouldReturnUnauthorized_WithoutToken()
  {
    var request = new CreateUrlRequest("https://example.com");

    var response = await _client.PostAsJsonAsync("/api/urls", request);

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task CreateUrl_ShouldReturnBadRequest_WithInvalidUrl()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    var request = new CreateUrlRequest("not-a-url");
    var response = await _client.PostAsJsonAsync("/api/urls", request);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task GetAllUrls_ShouldReturnUserUrls()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    await _client.PostAsJsonAsync("/api/urls", new CreateUrlRequest("https://example1.com"));
    await _client.PostAsJsonAsync("/api/urls", new CreateUrlRequest("https://example2.com"));

    var response = await _client.GetAsync("/api/urls?page=1&limit=10");

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var result = await response.Content.ReadFromJsonAsync<UrlListResponse>();
    result.Should().NotBeNull();
    result!.Records.Should().HaveCountGreaterOrEqualTo(2);
    result.TotalOfRecords.Should().BeGreaterOrEqualTo(2);
  }

  [Fact]
  public async Task GetAllUrls_ShouldReturnUnauthorized_WithoutToken()
  {
    var response = await _client.GetAsync("/api/urls");

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task GetAllUrls_ShouldSupportPagination()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    for (int i = 0; i < 5; i++)
    {
      await _client.PostAsJsonAsync("/api/urls", new CreateUrlRequest($"https://example{i}.com"));
    }

    var response = await _client.GetAsync("/api/urls?page=1&limit=2");
    var result = await response.Content.ReadFromJsonAsync<UrlListResponse>();

    result!.Records.Should().HaveCount(2);
  }

  [Fact]
  public async Task GetUrlByCode_ShouldReturnUrl_WhenCodeExists()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    var createResponse = await _client.PostAsJsonAsync("/api/urls",
        new CreateUrlRequest("https://example.com/bycode"));
    var createdUrl = await createResponse.Content.ReadFromJsonAsync<UrlDto>();

    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/urls/code/{createdUrl!.Code}");

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var result = await response.Content.ReadFromJsonAsync<UrlDto>();
    result.Should().NotBeNull();
    result!.Code.Should().Be(createdUrl.Code);
    result.Original.Should().Be("https://example.com/bycode");
  }

  [Fact]
  public async Task GetUrlByCode_ShouldReturnNotFound_WhenCodeDoesNotExist()
  {
    var response = await _client.GetAsync("/api/urls/code/NOTFOUND");

    response.StatusCode.Should().Be(HttpStatusCode.NotFound);
  }

  [Fact]
  public async Task GetUrlById_ShouldReturnUrl_WhenIdExists()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    var createResponse = await _client.PostAsJsonAsync("/api/urls",
        new CreateUrlRequest("https://example.com/byid"));
    var createdUrl = await createResponse.Content.ReadFromJsonAsync<UrlDto>();

    _client.DefaultRequestHeaders.Authorization = null;
    var response = await _client.GetAsync($"/api/urls/{createdUrl!.Id}");

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var result = await response.Content.ReadFromJsonAsync<UrlDto>();
    result.Should().NotBeNull();
    result!.Id.Should().Be(createdUrl.Id);
  }

  [Fact]
  public async Task GetUrlById_ShouldReturnNotFound_WhenIdDoesNotExist()
  {
    var response = await _client.GetAsync("/api/urls/999999");

    response.StatusCode.Should().Be(HttpStatusCode.NotFound);
  }

  [Fact]
  public async Task DeleteUrl_ShouldReturnNoContent_WhenOwnerDeletesUrl()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    var createResponse = await _client.PostAsJsonAsync("/api/urls",
        new CreateUrlRequest("https://example.com/todelete"));
    var createdUrl = await createResponse.Content.ReadFromJsonAsync<UrlDto>();

    var response = await _client.DeleteAsync($"/api/urls/{createdUrl!.Id}");

    response.StatusCode.Should().Be(HttpStatusCode.NoContent);
  }

  [Fact]
  public async Task DeleteUrl_ShouldReturnUnauthorized_WithoutToken()
  {
    var response = await _client.DeleteAsync("/api/urls/1");

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
  }

  [Fact]
  public async Task DeleteUrl_ShouldReturnForbidden_WhenNonOwnerTriesToDelete()
  {
    var token1 = await GetAuthTokenAsync();
    SetAuthToken(token1);

    var createResponse = await _client.PostAsJsonAsync("/api/urls",
        new CreateUrlRequest("https://example.com/protected"));
    var createdUrl = await createResponse.Content.ReadFromJsonAsync<UrlDto>();

    var token2 = await GetAuthTokenAsync();
    SetAuthToken(token2);

    var response = await _client.DeleteAsync($"/api/urls/{createdUrl!.Id}");

    response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
  }

  [Fact]
  public async Task DeleteUrl_ShouldReturnNotFound_WhenUrlDoesNotExist()
  {
    var token = await GetAuthTokenAsync();
    SetAuthToken(token);

    var response = await _client.DeleteAsync("/api/urls/999999");

    response.StatusCode.Should().Be(HttpStatusCode.NotFound);
  }
}
