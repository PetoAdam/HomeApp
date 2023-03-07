using Microsoft.EntityFrameworkCore;

namespace ApiGateway.Dal
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<IdentityUser> Users { get; set; }
        public virtual DbSet<IdentityRole> Roles { get; set; }
        public virtual DbSet<IdentityUserRole> UserRoles { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Measurement> Measurements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUser>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserName).HasColumnName("user_name");
                entity.Property(e => e.NormalizedUserName).HasColumnName("normalized_user_name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.NormalizedEmail).HasColumnName("normalized_email");
                entity.Property(e => e.EmailConfirmed).HasColumnName("email_confirmed");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.TwoFactorEnabled).HasColumnName("two_factor_enabled");
                entity.Property(e => e.LockoutEnd).HasColumnName("lockout_end");
                entity.Property(e => e.LockoutEnabled).HasColumnName("lockout_enabled");
                entity.Property(e => e.AccessFailedCount).HasColumnName("access_failed_count");
            });

            modelBuilder.Entity<IdentityRole>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.NormalizedName).HasColumnName("normalized_name");
            });

            modelBuilder.Entity<IdentityUserRole>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.RoleId).HasColumnName("role_id");
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.Property(e => e.ZipCode).HasColumnName("zip_code");
            });

            modelBuilder.Entity<Measurement>(entity =>
            {
                entity.Property(e => e.LocationId).HasColumnName("location_id");
            });

        }

    }
}