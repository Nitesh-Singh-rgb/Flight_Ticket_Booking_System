using FlightApi.Convertors;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using MySql.EntityFrameworkCore.Extensions;
namespace FlightApi.Data;

public class FlightDbContext : DbContext
{
    public DbSet<Flight> flights { get; set; }

    public FlightDbContext()
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Flight>()
             .Property(x => x.flightNumber)
             .ValueGeneratedOnAdd();

    }

    protected override void ConfigureConventions(ModelConfigurationBuilder builder)
    {
        builder.Properties<DateOnly>()
        .HaveConversion<DateOnlyConverter>()
        .HaveColumnType("date");

        builder.Properties<TimeOnly>()
       .HaveConversion<TimeOnlyConverter>()
       .HaveColumnType("time");

        base.ConfigureConventions(builder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL("Data Source=localhost;Database=book_my_flight;User Id=root;Password=root");
    }

}