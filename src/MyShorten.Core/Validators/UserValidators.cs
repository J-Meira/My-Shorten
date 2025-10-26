using FluentValidation;
using MyShorten.Core.DTOs;

namespace MyShorten.Core.Validators;

public class SignUpRequestValidator : AbstractValidator<SignUpRequest>
{
  public SignUpRequestValidator()
  {
    RuleFor(x => x.Name)
        .NotEmpty()
        .WithMessage("name is required")
        .MinimumLength(3)
        .WithMessage("name must be at least 3 characters")
        .MaximumLength(150)
        .WithMessage("name must not exceed 150 characters");

    RuleFor(x => x.Email)
        .NotEmpty()
        .WithMessage("email is required")
        .EmailAddress()
        .WithMessage("email is invalid")
        .MaximumLength(150)
        .WithMessage("email must not exceed 150 characters");

    RuleFor(x => x.Password)
        .NotEmpty()
        .WithMessage("password is required")
        .MinimumLength(10)
        .WithMessage("password must be at least 10 characters")
        .Must(HaveValidPasswordComplexity)
        .WithMessage("password invalid, must including at least one number, one upper case letter, one down case letter and one special character");
  }

  private bool HaveValidPasswordComplexity(string password)
  {
    var hasLowerCase = password.Any(char.IsLower);
    var hasUpperCase = password.Any(char.IsUpper);
    var hasDigit = password.Any(char.IsDigit);
    var hasSpecialChar = password.Any(c => " `!@#$%^&*()_+-=[]{}; ':\"\\|,.<>/?~".Contains(c));

    return hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;
  }
}

public class SignInRequestValidator : AbstractValidator<SignInRequest>
{
  public SignInRequestValidator()
  {
    RuleFor(x => x.Email)
        .NotEmpty()
        .WithMessage("email is required")
        .EmailAddress()
        .WithMessage("email is invalid");

    RuleFor(x => x.Password)
        .NotEmpty()
        .WithMessage("password is required");
  }
}
