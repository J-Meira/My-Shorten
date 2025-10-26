namespace MyShorten.Core.DTOs;

public record CreateUrlRequest(
    string Url
);

public record UrlDto(
    long Id,
    string Code,
    string Original,
    long UserId
);

public record UrlListResponse(
    List<UrlDto> Records,
    int TotalOfRecords
);
