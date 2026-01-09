using Microsoft.EntityFrameworkCore;

namespace Vastin.Models;

public class VastinDbContext : DbContext
{
    public VastinDbContext(DbContextOptions<VastinDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired();
            entity.Property(e => e.Password).IsRequired();
        });
        
        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.Length).IsRequired();
            entity.Property(e => e.VideoPath).IsRequired();
            
            entity.HasOne(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired();
            
            entity.HasOne(e => e.CommentOwner)
                .WithMany()
                .HasForeignKey(e => e.CommentOwnerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(e => e.VideoOwner)
                .WithMany()
                .HasForeignKey(e => e.VideoOwnerId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}