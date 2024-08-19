namespace FlightApi.Exceptions;

public class FlightException : System.Exception
{
    public FlightException() { }
    public FlightException(string message) : base(message) { }
    public FlightException(string message, System.Exception inner) : base(message, inner) { }
}

