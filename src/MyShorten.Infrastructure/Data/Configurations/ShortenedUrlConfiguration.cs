using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyShorten.Core.Entities;

namespace MyShorten.Infrastructure.Data.Configurations;

public class ShortenedUrlConfiguration : IEntityTypeConfiguration<ShortenedUrl>
{
    public void Configure(EntityTypeBuilder<ShortenedUrl> builder)
    {
        builder.ToTable("urls");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(s => s.Code)
            .HasColumnName("code")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(s => s.Original)
            .HasColumnName("original")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(s => s.UserId)
            .HasColumnName("userId")
            .IsRequired();

        builder.HasIndex(s => s.Code)
            .IsUnique();

        builder.HasIndex(s => s.UserId);
    }
}
