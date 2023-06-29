using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;

namespace DatabaseService.Dal
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Device> Devices { get; set; }
        public virtual DbSet<Measurement> Measurements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Device>(entity =>
            {
                entity.Property(e => e.LocationId).HasColumnName("location_id");
                entity.Property(e => e.Zigbee2mqttId).HasColumnName("zigbee2mqtt_id");
            });

            modelBuilder.Entity<Measurement>(entity =>
            {
                entity.Property(e => e.DeviceId).HasColumnName("device_id");
            });

        }

    }
}