using FluentAssertions;
using MyShorten.Core.DTOs;
using MyShorten.Core.Validators;

namespace MyShorten.Tests.Unit.Validators;

public class UrlValidatorsTests
{
  private readonly CreateUrlRequestValidator _validator;

  public UrlValidatorsTests()
  {
    _validator = new CreateUrlRequestValidator();
  }

  [Fact]
  public void CreateUrlRequest_ShouldBeValid_WithValidUrl()
  {
    var request = new CreateUrlRequest("https://example.com");

    var result = _validator.Validate(request);

    result.IsValid.Should().BeTrue();
  }

  [Theory]
  [InlineData("")]
  public void CreateUrlRequest_ShouldBeInvalid_WhenOriginalIsEmpty(string original)
  {
    var request = new CreateUrlRequest(original);

    var result = _validator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Url");
  }

  [Theory]
  [InlineData("not-a-url")]
  [InlineData("htp://wrong-protocol.com")]
  [InlineData("example.com")]
  public void CreateUrlRequest_ShouldBeInvalid_WithInvalidUrlFormat(string original)
  {
    var request = new CreateUrlRequest(original);

    var result = _validator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Url");
  }

  [Fact]
  public void CreateUrlRequest_ShouldBeInvalid_WhenUrlIsTooLong()
  {
    var longUrl = "https://example.com/" + new string('a', 1000);
    var request = new CreateUrlRequest(longUrl);

    var result = _validator.Validate(request);

    result.IsValid.Should().BeFalse();
    result.Errors.Should().Contain(e => e.PropertyName == "Url");
  }

  [Theory]
  [InlineData("https://example.com")]
  [InlineData("http://example.com")]
  [InlineData("https://sub.example.com/path?query=value")]
  [InlineData("https://example.com:8080/path")]
  public void CreateUrlRequest_ShouldBeValid_WithVariousValidUrls(string original)
  {
    var request = new CreateUrlRequest(original);

    var result = _validator.Validate(request);

    result.IsValid.Should().BeTrue();
  }
}
