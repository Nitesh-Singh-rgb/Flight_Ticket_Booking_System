using System.Collections.ObjectModel;
using FlightApi.Data;
using FlightApi.Exceptions;
using FlightApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlightApi.Controllers;

// [Route("api/[controller]")]

[ApiController]
public class AirlineController(FlightModel flightModel) : ControllerBase
{
    [HttpGet]
    [Route("/flight/fetchall")]
    public IEnumerable<Flight> SearchFlights()
    {
        return flightModel.fetchAll();
    }

    [HttpPost]
    [Route("/flight/add")]
    [Consumes("application/json")]
    public String AddFlight([FromBody] Flight flight)
    {
        try
        {
            int id = flightModel.AddFlight(flight);
            return "Flight added with flight number " + id;
        }
        catch (FlightException e)
        {
            return e.StackTrace + " " + e.Message;
        }
    }

    [HttpGet]
    [Route("/flight/fetch")]
    [Produces("application/json")]
    public IActionResult SearchFlight([FromQuery] string source, [FromQuery] string destination, [FromQuery] string date)
    {
        try
        {
            DateOnly dt = DateOnly.Parse(date);
            List<Flight> flights = (List<Flight>)flightModel.FetchFlightOnCondition(source, destination, dt);
            return Ok(flights);
        }
        catch (FlightException e)
        {
            return NotFound("" + e.StackTrace + " " + e.Message);
        }
    }

    [HttpDelete]
    [Route("/flight/remove/{fid}")]
    public string RemoveFlight(int fid)
    {
        bool flag = flightModel.RemoveFlight(fid);
        return flag ? "Flight removed with id " + fid : "Flight not found";
    }

    [HttpPut]
    [Route("/flight/update")]
    [Produces("application/json")]
    public string UpdateFlight([FromBody] Flight flight)
    {
        try
        {
            int id = flightModel.UpdateFlight(flight);
            return "Flight updated with id" + id;
        }
        catch (FlightException e)
        {
            return e.StackTrace + " " + e.Message;
        }
    }



}

