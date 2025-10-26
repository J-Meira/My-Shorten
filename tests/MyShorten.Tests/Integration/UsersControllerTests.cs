using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using MyShorten.Core.DTOs;
using MyShorten.Infrastructure.Data;
using MyShorten.Tests.Infrastructure;

namespace MyShorten.Tests.Integration;

public class UsersControllerTests : IClassFixture<CustomWebApplicationFactory>
{
  private readonly HttpClient _client;
  private readonly CustomWebApplicationFactory _factory;

  public UsersControllerTests(CustomWebApplicationFactory factory)
  {
    _factory = factory;
    _client = factory.CreateClient();
  }

  [Fact]
  public async Task SignUp_ShouldReturnCreated_WithValidData()
  {
    var request = new SignUpRequest(
        "John Doe",
        $"john{Guid.NewGuid()}@test.com",
        "Password123!"
    );

    var response = await _client.PostAsJsonAsync("/api/users/sign-up", request);

    response.StatusCode.Should().Be(HttpStatusCode.Created);

    var result = await response.Content.ReadFromJsonAsync<UserDto>();
    result.Should().NotBeNull();
    result!.Email.Should().Be(request.Email);
    result.Name.Should().Be(request.Name);
  }

  [Fact]
  public async Task SignUp_ShouldReturnBadRequest_WithInvalidEmail()
  {
    var request = new SignUpRequest(
        "John Doe",
        "invalid-email",
        "Password123!"
    );

    var response = await _client.PostAsJsonAsync("/api/users/sign-up", request);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task SignUp_ShouldReturnBadRequest_WithWeakPassword()
  {
    var request = new SignUpRequest(
        "John Doe",
        "john@test.com",
        "weak"
    );

    var response = await _client.PostAsJsonAsync("/api/users/sign-up", request);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task SignUp_ShouldReturnBadRequest_WhenEmailAlreadyExists()
  {
    var email = $"duplicate{Guid.NewGuid()}@test.com";
    var request1 = new SignUpRequest("User One", email, "Password123!");
    var request2 = new SignUpRequest("User Two", email, "Password123!");

    await _client.PostAsJsonAsync("/api/users/sign-up", request1);
    var response = await _client.PostAsJsonAsync("/api/users/sign-up", request2);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task SignIn_ShouldReturnOk_WithValidCredentials()
  {
    var email = $"signin{Guid.NewGuid()}@test.com";
    var password = "Password123!";

    var signUpRequest = new SignUpRequest("Test User", email, password);
    await _client.PostAsJsonAsync("/api/users/sign-up", signUpRequest);

    var signInRequest = new SignInRequest(email, password);
    var response = await _client.PostAsJsonAsync("/api/users/sign-in", signInRequest);

    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var result = await response.Content.ReadFromJsonAsync<SignInResponse>();
    result.Should().NotBeNull();
    result!.AccessToken.Should().NotBeNullOrEmpty();
    result.ExpiresIn.Should().BeAfter(DateTime.UtcNow);
  }

  [Fact]
  public async Task SignIn_ShouldReturnBadRequest_WithInvalidPassword()
  {
    var email = $"wrongpass{Guid.NewGuid()}@test.com";
    var signUpRequest = new SignUpRequest("Test User", email, "Password123!");
    await _client.PostAsJsonAsync("/api/users/sign-up", signUpRequest);

    var signInRequest = new SignInRequest(email, "WrongPassword!");
    var response = await _client.PostAsJsonAsync("/api/users/sign-in", signInRequest);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task SignIn_ShouldReturnBadRequest_WithNonExistentEmail()
  {
    var signInRequest = new SignInRequest("nonexistent@test.com", "Password123!");

    var response = await _client.PostAsJsonAsync("/api/users/sign-in", signInRequest);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }

  [Fact]
  public async Task SignIn_ShouldReturnBadRequest_WithInvalidEmail()
  {
    var signInRequest = new SignInRequest("invalid-email", "Password123!");

    var response = await _client.PostAsJsonAsync("/api/users/sign-in", signInRequest);

    response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
  }
}
