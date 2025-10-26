using FluentValidation;
using MyShorten.Core.DTOs;

namespace MyShorten.Core.Validators;

public class CreateUrlRequestValidator : AbstractValidator<CreateUrlRequest>
{
    public CreateUrlRequestValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty()
            .MaximumLength(1000)
            .Must(BeAValidUrl)
            .WithMessage("Must be a valid URL");
    }

    private bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
