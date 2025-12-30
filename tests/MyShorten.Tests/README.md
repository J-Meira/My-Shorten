# Test Suite Documentation

## Overview
Comprehensive test suite for My-Shorten .NET 10.0 API covering:
- **Unit Tests**: Repository methods and FluentValidation validators
- **Integration Tests**: API endpoints end-to-end with in-memory database

## Test Structure

```
tests/MyShorten.Tests/
├── MyShorten.Tests.csproj
├── GlobalUsings.cs
├── Infrastructure/
│   ├── CustomWebApplicationFactory.cs    # Test server setup
│   └── TestDataHelper.cs                 # Test data creation helpers
├── Unit/
│   ├── Repositories/
│   │   ├── UserRepositoryTests.cs        # User data access tests
│   │   └── UrlRepositoryTests.cs         # URL data access tests
│   └── Validators/
│       ├── UserValidatorsTests.cs        # User validation tests
│       └── UrlValidatorsTests.cs         # URL validation tests
└── Integration/
    ├── UsersControllerTests.cs           # Authentication endpoint tests
    └── UrlsControllerTests.cs            # URL shortening endpoint tests
```

## Key Corrections Made

### 1. Entity Property Names
- `CreateUrlRequest` has single parameter: `string Url` (not `Original` and `ExpiresIn`)
- `ShortenedUrl` entity has `long Id` and `long UserId` (not `int`)
- `SignInResponse` has `AccessToken` (not `Token`)
- `UrlListResponse` has `Records` and `TotalOfRecords` (not `Items` and `TotalCount`)

### 2. Repository Return Types
- `CreateAsync` methods return `long` (ID), not the entity
- `GetAllByUserIdAsync` returns tuple: `(List<ShortenedUrl> urls, int totalCount)`

### 3. Test Data
- `ShortenedUrl` does not have `ExpiresIn` property in entity (it's in DTO/request only)
- All IDs are `long` type, not `int`

## Running Tests

### Run All Tests
```bash
dotnet test tests/MyShorten.Tests/MyShorten.Tests.csproj
```

### Run Specific Test Category
```bash
# Unit tests only
dotnet test --filter "FullyQualifiedName~MyShorten.Tests.Unit"

# Integration tests only
dotnet test --filter "FullyQualifiedName~MyShorten.Tests.Integration"

# Specific test class
dotnet test --filter "FullyQualifiedName~UserRepositoryTests"
```

### Run with Detailed Output
```bash
dotnet test --logger "console;verbosity=detailed"
```

## Test Coverage

### Unit Tests - Repositories

#### UserRepositoryTests (6 tests)
- ✅ CreateAsync_ShouldCreateUser
- ✅ GetByIdAsync_ShouldReturnUser_WhenUserExists
- ✅ GetByIdAsync_ShouldReturnNull_WhenUserDoesNotExist
- ✅ GetByEmailAsync_ShouldReturnUser_WhenEmailExists
- ✅ GetByEmailAsync_ShouldReturnNull_WhenEmailDoesNotExist
- ✅ EmailExistsAsync_ShouldReturnTrue/False

#### UrlRepositoryTests (8 tests)
- ✅ CreateAsync_ShouldCreateUrl
- ✅ GetByIdAsync_ShouldReturnUrl_WhenUrlExists/DoesNotExist
- ✅ GetByCodeAsync_ShouldReturnUrl_WhenCodeExists/DoesNotExist
- ✅ GetAllByUserIdAsync_ShouldReturnPaginatedUrls
- ✅ GetAllByUserIdAsync_ShouldReturnOnlyUserUrls
- ✅ GetAllByUserIdAsync_ShouldSortCorrectly
- ✅ DeleteAsync_ShouldRemoveUrl

### Unit Tests - Validators

#### UserValidatorsTests (12 tests)
- ✅ SignUpRequest validation (name, email, password)
- ✅ Password complexity validation (uppercase, lowercase, digit, special char)
- ✅ SignInRequest validation (email, password)

#### UrlValidatorsTests (6 tests)
- ✅ CreateUrlRequest validation (URL format, length)
- ✅ Various valid URL formats

### Integration Tests

#### UsersControllerTests (7 tests)
- ✅ POST /sign-up (success, validation errors, duplicate email)
- ✅ POST /sign-in (success, invalid password, non-existent email, validation errors)

#### UrlsControllerTests (12 tests)
- ✅ POST /urls (success, unauthorized, validation)
- ✅ GET /urls (success, unauthorized, pagination)
- ✅ GET /get-url/{code} (success, not found)
- ✅ GET /urls/{id} (success, not found)
- ✅ DELETE /urls/{id} (success, unauthorized, forbidden, not found)

**Total: 51 tests**

## Test Principles

Following the copilot-instructions.md guidelines:

### 1. Clean Code
- No unnecessary comments
- Self-explanatory test names
- Modern C# features (records, pattern matching)

### 2. Isolation
- Each unit test uses separate in-memory database
- Integration tests use `CustomWebApplicationFactory` with fresh database
- Tests are independent and can run in parallel

### 3. Arrange-Act-Assert Pattern
```csharp
[Fact]
public async Task MethodName_ShouldExpectedBehavior_WhenCondition()
{
    // Arrange
    var input = CreateTestData();

    // Act
    var result = await _repository.MethodAsync(input);

    // Assert
    result.Should().NotBeNull();
}
```

### 4. FluentAssertions
Using FluentAssertions for readable assertions:
- `result.Should().NotBeNull()`
- `result.Should().Be(expected)`
- `response.StatusCode.Should().Be(HttpStatusCode.OK)`

### 5. Test Data
- Unique emails using `Guid.NewGuid()` to avoid collisions
- `TestDataHelper` for consistent test data creation
- BCrypt password hashing in test data

## Configuration

### Test Project Dependencies
- **xUnit**: Test framework
- **FluentAssertions**: Readable assertions
- **Moq**: Mocking framework (for future service layer tests)
- **Microsoft.AspNetCore.Mvc.Testing**: Integration testing with TestServer
- **Microsoft.EntityFrameworkCore.InMemory**: In-memory database for tests

### Test Environment
- Uses "Testing" environment
- In-memory database (fresh for each test)
- No external dependencies
- No actual HTTP calls

## Best Practices

1. **Test Names**: `MethodName_ShouldExpectedBehavior_WhenCondition`
2. **One Assert Per Test**: Focus on single behavior
3. **Test Independence**: No shared state between tests
4. **Fast Tests**: In-memory database, no I/O
5. **Readable Tests**: Clear arrange-act-assert structure

## Future Enhancements

- [ ] Add service layer tests with mocked repositories
- [ ] Add authentication middleware tests
- [ ] Add global exception handler tests
- [ ] Add performance tests
- [ ] Add test coverage reporting
- [ ] Add mutation testing

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Program is inaccessible"
**Solution**: Add `public partial class Program { }` to Program.cs

**Issue**: Wrong property names in assertions
**Solution**: Check actual DTO/entity definitions in Core project

**Issue**: Type mismatch (int vs long)
**Solution**: All IDs are `long` in this project

**Issue**: Database concurrency issues
**Solution**: Each test uses unique database name via `Guid.NewGuid()`
