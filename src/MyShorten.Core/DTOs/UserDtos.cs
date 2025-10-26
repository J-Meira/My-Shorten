namespace MyShorten.Core.DTOs;

public record SignUpRequest(
    string Name,
    string Email,
    string Password
);

public record SignInRequest(
    string Email,
    string Password
);

public record SignInResponse(
    string AccessToken,
    DateTime ExpiresIn,
    UserDto User
);

public record UserDto(
    long Id,
    string Name,
    string Email
);
