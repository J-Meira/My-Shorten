# My-Shorten - Migration to .NET 9.0

## Project Overview

Full-stack URL shortener application migrating from Node.js/TypeScript to .NET 9.0, while keeping React/Vite frontend.

### Technology Stack

**Current (Node.js API - to be migrated):**
- Express + TypeScript
- Knex.js with MySQL
- JWT authentication
- bcryptjs for password hashing

**Target (.NET 9.0 API):**
- ASP.NET Core Web API
- Entity Framework Core with PostgreSQL
- JWT Bearer authentication
- BCrypt.Net-Next for password hashing
- FluentValidation for request validation

**Frontend (unchanged):**
- React 18 + TypeScript
- Vite build tool
- Material-UI (MUI)
- Redux Toolkit
- React Router DOM

## Solution Structure

```
My-Shorten/
├── MyShorten.sln                    # .NET solution at root
├── src/
│   ├── MyShorten.API/              # ASP.NET Core Web API
│   │   ├── Controllers/            # API endpoints
│   │   ├── Middleware/             # Custom middleware
│   │   ├── Configuration/          # Service registration extensions
│   │   ├── wwwroot/                # React build output (gitignored)
│   │   ├── Program.cs              # Application entry point
│   │   └── appsettings.json        # Configuration
│   ├── MyShorten.Core/             # Business logic & domain models
│   │   ├── Entities/               # Domain entities
│   │   ├── DTOs/                   # Data transfer objects
│   │   ├── Interfaces/             # Repository/service interfaces
│   │   └── Validators/             # FluentValidation validators
│   ├── MyShorten.Infrastructure/   # Data access & external services
│   │   ├── Data/                   # DbContext & configurations
│   │   ├── Repositories/           # Repository implementations
│   │   └── Migrations/             # EF Core migrations
│   └── MyShorten.Client/           # React frontend (builds to wwwroot)
├── tests/
│   └── MyShorten.Tests/            # Unit & integration tests
└── api/                             # Legacy Node.js API (reference only)
```

## Architecture Patterns

### Clean Architecture Principles
- **API Layer**: Controllers, middleware, configuration only
- **Core Layer**: Domain entities, interfaces, DTOs, business rules (no external dependencies)
- **Infrastructure Layer**: Data access, external services, repository implementations

### Dependency Flow
API → Core ← Infrastructure

## Coding Standards

### Critical Rules

**No unnecessary comments - Only explain non-obvious "why"**

Examples of GOOD comments:
```csharp
// Using MD5 for short hash generation, not security
var hash = MD5.HashData(Encoding.UTF8.GetBytes(originalUrl));

// Retry logic needed due to potential race condition on unique constraint
await retryPolicy.ExecuteAsync(() => _repository.SaveAsync(entity));
```

Examples of BAD comments (avoid these):
```csharp
// Get user by ID
var user = await _repository.GetByIdAsync(id);

// Return OK response
return Ok(result);
```

### C# Conventions

**Naming:**
- PascalCase: Classes, methods, properties, public fields
- camelCase: Private fields, local variables, parameters
- Prefix interfaces with `I`: `IUserRepository`
- Async methods suffix: `GetUserAsync`, `SaveChangesAsync`

**Structure:**
```csharp
public class ExampleController : ControllerBase
{
    private readonly IExampleService _service;
    private readonly ILogger<ExampleController> _logger;

    public ExampleController(IExampleService service, ILogger<ExampleController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExampleDto>> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }
}
```

**Use modern C# features:**
- Record types for DTOs
- Pattern matching
- Null-coalescing operators (`??`, `??=`)
- String interpolation
- Target-typed `new()`
- File-scoped namespaces
- Primary constructors (C# 12)

### Entity Framework Core

**DbContext:**
```csharp
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<ShortenedUrl> ShortenedUrls => Set<ShortenedUrl>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

**Entity Configuration:**
- Use `IEntityTypeConfiguration<T>` for fluent configurations
- Configure indexes, constraints, relationships explicitly
- Use database-generated values where appropriate

### API Design

**RESTful conventions:**
- GET: Retrieve resources
- POST: Create new resources
- PUT: Full update
- PATCH: Partial update
- DELETE: Remove resources

**Route structure:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class LinksController : ControllerBase
{
    // GET: api/links
    // GET: api/links/{id}
    // POST: api/links
    // PUT: api/links/{id}
    // DELETE: api/links/{id}
}
```

**Response patterns:**
- 200 OK: Successful GET, PUT, PATCH
- 201 Created: Successful POST (with Location header)
- 204 No Content: Successful DELETE
- 400 Bad Request: Validation errors
- 401 Unauthorized: Missing/invalid authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Unhandled exceptions

### Validation

Use FluentValidation for request validation:

```csharp
public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8);
    }
}
```

### Error Handling

Global exception handling middleware for consistent error responses:

```csharp
{
    "status": 400,
    "title": "Validation Error",
    "errors": {
        "Email": ["Email is required"]
    }
}
```

### Authentication & Authorization

**JWT Bearer tokens:**
- Use `Microsoft.AspNetCore.Authentication.JwtBearer`
- Store sensitive config in User Secrets (dev) / Environment Variables (prod)
- Token expiration: configurable
- Refresh token pattern: optional

**Authorization:**
```csharp
[Authorize]
[HttpGet("profile")]
public async Task<ActionResult<UserDto>> GetProfile()
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    // ...
}
```

## Migration Mapping

### Node.js → .NET Equivalents

| Node.js Package | .NET Equivalent |
|----------------|-----------------|
| express | ASP.NET Core |
| knex | Entity Framework Core |
| mysql2 | Npgsql.EntityFrameworkCore.PostgreSQL |
| bcryptjs | BCrypt.Net-Next |
| jsonwebtoken | System.IdentityModel.Tokens.Jwt |
| yup | FluentValidation |
| moment | DateTime / DateTimeOffset |
| cors | Built-in CORS middleware |
| dotenv | appsettings.json + User Secrets |

### Controller Migration Pattern

**From TypeScript Controller:**
```typescript
// api/src/controllers/Users.ts
export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UsersProvider.getById(Number(id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
};
```

**To C# Controller:**
```csharp
// src/MyShorten.API/Controllers/UsersController.cs
[HttpGet("{id}")]
public async Task<ActionResult<UserDto>> GetById(int id)
{
    var user = await _userService.GetByIdAsync(id);
    return user is null ? NotFound() : Ok(user);
}
```

## Static File Serving

The .NET API serves the React build from `wwwroot`:

**Vite Configuration (`src/client/vite.config.ts`):**
```typescript
export default defineConfig({
  build: {
    outDir: '../MyShorten.API/wwwroot',
    emptyOutDir: true
  }
})
```

**Program.cs Configuration:**
```csharp
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
```

**Route Strategy:**
- `/api/*` - API endpoints
- `/*` - React SPA (all other routes)

## Database

**PostgreSQL Connection:**
- Use Npgsql.EntityFrameworkCore.PostgreSQL provider
- Connection string format: `Host=localhost;Database=myshorten;Username=postgres;Password=yourpassword`
- Connection string in appsettings.json (use User Secrets for dev)
- Enable retry on failure for production

**appsettings.json example:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=myshorten;Username=postgres;Password=yourpassword"
  }
}
```

**Program.cs registration:**
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Migrations:**
```bash
# Create migration
dotnet ef migrations add InitialCreate --project src/MyShorten.Infrastructure --startup-project src/MyShorten.API

# Update database
dotnet ef database update --project src/MyShorten.Infrastructure --startup-project src/MyShorten.API
```

**PostgreSQL-specific features:**
- Use `HasDefaultValueSql("gen_random_uuid()")` for UUID columns
- Use `HasColumnType("timestamp with time zone")` for timestamps
- Enable PostgreSQL conventions: `options.UseNpgsql().UseSnakeCaseNamingConvention()` (optional)

## Development Workflow

**Running the application:**

1. **Development (separate frontend/backend):**
   ```bash
   # Terminal 1 - Frontend
   cd src/client
   npm run dev  # Runs on http://localhost:3005

   # Terminal 2 - Backend
   cd src/MyShorten.API
   dotnet run   # Runs on http://localhost:5000
   ```

2. **Production-like (integrated):**
   ```bash
   # Build frontend
   cd src/client
   npm run build  # Outputs to ../MyShorten.API/wwwroot

   # Run backend (serves both API and static files)
   cd ../MyShorten.API
   dotnet run
   ```

## Testing

**Unit Tests:**
- Use xUnit
- Mock dependencies with Moq or NSubstitute
- Test business logic in Core layer

**Integration Tests:**
- Use WebApplicationFactory<Program>
- Test API endpoints end-to-end
- Use in-memory database or test containers with PostgreSQL for isolation

## Security Best Practices

- Never commit secrets (use User Secrets locally, environment variables in production)
- Use parameterized queries (EF Core does this automatically)
- Validate all inputs with FluentValidation
- Use HTTPS in production
- Implement rate limiting for public endpoints
- Hash passwords with BCrypt (work factor: 12)
- Set secure JWT token expiration times
- Use `[Authorize]` attribute appropriately

## Performance

- Use async/await consistently
- Enable response compression
- Implement caching where appropriate (IMemoryCache, IDistributedCache)
- Use pagination for list endpoints
- Project to DTOs to avoid over-fetching
- Use `AsNoTracking()` for read-only queries

## Git Workflow

**Branches:**
- `master` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes

**Commits:**
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Keep commits focused and atomic
- Reference issues in commit messages

## AI Assistance Guidelines

When asking Copilot for help:

1. **Be specific about the layer:** "Create a repository in Infrastructure layer" vs "Create a repository"
2. **Reference existing patterns:** "Follow the same pattern as UsersController"
3. **Specify the migration source:** "Migrate the auth controller from api/src/controllers/Auth.ts"
4. **Request tests:** "Include unit tests for this service"
5. **Ask for complete implementations:** "Implement the full CRUD operations for Links"

## References

**Legacy API:** `api/src/` - Reference for business logic and API contracts
**Frontend:** `src/client/src/` - React app that will consume the new API
**Documentation:** Update README.md as you migrate features

---

Remember: Clean, maintainable code over clever code. Prioritize readability and testability.
