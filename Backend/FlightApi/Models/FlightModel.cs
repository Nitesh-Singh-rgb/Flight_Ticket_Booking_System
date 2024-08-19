using System.Collections;
using System.Collections.ObjectModel;
using FlightApi.Data;
using FlightApi.Exceptions;
using Org.BouncyCastle.Crypto.Signers;

namespace FlightApi.Models;
public class FlightModel(FlightDbContext flightDb)
{
    public IEnumerable<Flight> fetchAll()
    {
        // using var db = new FlightDbContext();
        List<Flight> flights = flightDb.flights.ToList();
        return flights;
    }

    public int AddFlight(Flight flight)
    {
        List<Flight> flights = (List<Flight>)fetchAll();
        Flight? flight_temp = null;

        foreach (Flight f in flights)
        {
            if (f.Equals(flights))
            {
                flight_temp = f;
            }
        }
        if (flight_temp == null)
        {
            flightDb.Add(flight);
            flightDb.SaveChanges();
            return flight.flightNumber;
        }
        else
        {
            throw new FlightException("Flight already exists with flight number" + flight.flightNumber);
        }
    }

    public bool RemoveFlight(int flightNumber)
    {
        Flight? found = flightDb.flights.Find(flightNumber);
        if (found != null)
        {
            flightDb.Remove(found);
            flightDb.SaveChanges();
            System.Console.WriteLine("Deleted flight");
            return true;
        }
        else
        {
            System.Console.WriteLine("Flight not found");
            return false;
        }
    }

    public IEnumerable<Flight> FetchFlightOnCondition(string source, string destination, DateOnly scheduleDate)
    {

        // var flights = (IQueryable<Flight>)(from flight in flightDb.flights
        //                                    where flight.source == source && flight.destination == destination && flight.travelDate == scheduleDate
        //                                    select flight);

        var flights = flightDb.flights
                        .Where(flight => flight.source == source && flight.destination == destination && flight.travelDate == scheduleDate)
                        .ToList();
        if (flights != null)
        {
            return flights;
        }
        else
        {
            throw new FlightException("Flight not found with provided details");
        }
    }

    public int UpdateFlight(Flight flight)
    {
        List<Flight> flights = (List<Flight>)fetchAll();
        Flight? flight1 = null;
        foreach (Flight f in flights)
        {
            if (f.flightNumber == flight.flightNumber)
            {
                flight1 = f;
            }
        }

        if (flight1 != null)
        {
            flight1 = flightDb.flights.Find(flight.flightNumber);
            flight1.source = flight.source;
            flight1.destination = flight.destination;
            flight1.travelDate = flight.travelDate;
            flight1.arrivalTime = flight.arrivalTime;
            flight1.departureTime = flight.departureTime;
            flight1.price = flight.price;
            flight1.availableSeats = flight.availableSeats;
            flightDb.SaveChanges();
            return flight.flightNumber;
        }
        else
        {
            throw new FlightException("Flight not Found with id " + flight.flightNumber);
        }

    }

}