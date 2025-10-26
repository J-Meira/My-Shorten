using FluentAssertions;
using MyShorten.Core.DTOs;
using MyShorten.Core.Validators;

namespace MyShorten.Tests.Unit.Validators;

public class UserValidatorsTests
{
  private readonly SignUpRequestValidator _signUpValidator;
  private readonly SignInRequestValidator _signInValidator;

  public UserValidatorsTests()
  {
    _signUpValidator = new SignUpRequestValidator();
    _signInValidator = new SignInRequestValidator();
  }

  [Fact]
  public void SignUpRequest_ShouldBeValid_WithCorrectData()
  {
    var request = new SignUpRequest(
        "John Doe",
        "john@test.com",
        "Password123!"
    );

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeTrue();
  }

  [Theory]
  [InlineData("")]
  public void SignUpRequest_ShouldBeInvalid_WhenNameIsEmpty(string name)
  {
    var request = new SignUpRequest(name, "john@test.com", "Password123!");

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Name");
  }

  [Fact]
  public void SignUpRequest_ShouldBeInvalid_WhenNameIsTooLong()
  {
    var longName = new string('a', 151);
    var request = new SignUpRequest(longName, "john@test.com", "Password123!");

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Name");
  }

  [Theory]
  [InlineData("")]
  [InlineData("invalid-email")]
  [InlineData("@test.com")]
  [InlineData("test@")]
  public void SignUpRequest_ShouldBeInvalid_WithInvalidEmail(string email)
  {
    var request = new SignUpRequest("John Doe", email, "Password123!");

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Email");
  }

  [Theory]
  [InlineData("")]
  [InlineData("short")]
  [InlineData("12345678")]
  public void SignUpRequest_ShouldBeInvalid_WhenPasswordIsTooShort(string password)
  {
    var request = new SignUpRequest("John Doe", "john@test.com", password);

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Password");
  }

  [Theory]
  [InlineData("alllowercase1!")]
  [InlineData("ALLUPPERCASE1!")]
  [InlineData("NoNumbers!!")]
  [InlineData("NoSpecialChars123")]
  public void SignUpRequest_ShouldBeInvalid_WithoutPasswordComplexity(string password)
  {
    var request = new SignUpRequest("John Doe", "john@test.com", password);

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Password"
        && e.ErrorMessage.Contains("uppercase, lowercase, number and special character"));
  }

  [Theory]
  [InlineData("Password123!")]
  [InlineData("MySecure@Pass1")]
  [InlineData("Valid#Pass123")]
  public void SignUpRequest_ShouldBeValid_WithValidPassword(string password)
  {
    var request = new SignUpRequest("John Doe", "john@test.com", password);

    var result = _signUpValidator.Validate(request);

    result.IsValid.Should().BeTrue();
  }

  [Fact]
  public void SignInRequest_ShouldBeValid_WithCorrectData()
  {
    var request = new SignInRequest("john@test.com", "Password123!");

    var result = _signInValidator.Validate(request);

    result.IsValid.Should().BeTrue();
  }

  [Theory]
  [InlineData("")]
  [InlineData("invalid-email")]
  public void SignInRequest_ShouldBeInvalid_WithInvalidEmail(string email)
  {
    var request = new SignInRequest(email, "Password123!");

    var result = _signInValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Email");
  }

  [Theory]
  [InlineData("")]
  public void SignInRequest_ShouldBeInvalid_WhenPasswordIsEmpty(string password)
  {
    var request = new SignInRequest("john@test.com", password);

    var result = _signInValidator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Password");
  }
}
