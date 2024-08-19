using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace FlightApi.Data;

[Table("flight")]
// [PrimaryKey("flightNumber")]
public class Flight
{
    [Key]
    [Column("flight_number")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int flightNumber { get; set; }

    [Column(TypeName = "varchar(255)")]
    public string? source { get; set; }

    [Column(TypeName = "varchar(255)")]
    public string? destination { get; set; }

    [Column("travel_date")]
    // [DataType(DataType.Date)]
    public DateOnly? travelDate { get; set; }

    [Column("arrival_time")]
    public TimeOnly? arrivalTime { get; set; }

    [Column("departure_time")]
    // [DataType(DataType.Time)]
    public TimeOnly? departureTime { get; set; }

    public double price { get; set; }
    [Column("available_seats")]
    public int availableSeats { get; set; }
}