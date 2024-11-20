import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FlightServiceRest from '../../../services/FlightServiceRest';

export default function UpdateFlight() {
    const [flightNumber, setFlightNumber] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [price, setPrice] = useState("");
    const [availableSeats, setAvailableSeats] = useState("");
    const [isadmin, setisadmin] = useState(false);
    const history = useNavigate();
    const service = new FlightServiceRest();
    const options = ['Chennai', 'Delhi', 'Mumbai', 'Kolkata', 'Goa', 'Pune', 'Jaipur', 'Banglore', 'Cochin', 'Ahmadabad'];

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            history("/login");
        } else if (JSON.parse(localStorage.getItem("user")).isadmin === 1) {
            const flight = JSON.parse(localStorage.getItem("flight"));
            if (flight) {
                setFlightNumber(flight.flightNumber);
                setSource(flight.source);
                setDestination(flight.destination);
                setTravelDate(flight.travelDate);
                setArrivalTime(flight.arrivalTime);
                setDepartureTime(flight.departureTime);
                setPrice(flight.price);
                setAvailableSeats(flight.availableSeats);
            }
        } else {
            history("/");
        }
    }, []);

    const handleInput = (events) => {
        const { name, value } = events.target;
        switch (name) {
            case "flightNumber":
                setFlightNumber(value);
                break;
            case "source":
                setSource(value);
                break;
            case "destination":
                setDestination(value);
                break;
            case "travelDate":
                setTravelDate(value);
                break;
            case "arrivalTime":
                setArrivalTime(value);
                break;
            case "departureTime":
                setDepartureTime(value);
                break;
            case "price":
                setPrice(value);
                break;
            case "availableSeats":
                setAvailableSeats(value);
                break;
            default:
                break;
        }
    };

    const onUpdate = (e) => {
        e.preventDefault();
        const flight = {
            flightNumber,
            source,
            destination,
            travelDate,
            arrivalTime,
            departureTime,
            price,
            availableSeats
        };
        service.updateFlight(flight);
        alert("Your flight has been updated");
        history("/allFlights");
    }

    return (
        <div className='home'>
            <div>
                <form onSubmit={onUpdate} id="updateForm">
                    <h3>Update Flight Schedule</h3>
                    <div>
                        <label htmlFor='flightNumber'>Flight Id</label>
                        <input type='number' value={flightNumber} name='flightNumber' disabled />
                    </div>
                    <div>
                        <label htmlFor='source'>Source</label>
                        <select id='source' name='source' value={source} onChange={handleInput} required>
                            {options.map((option) => (
                                <option key={option} value={option} onClick={handleInput}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='destination'>Destination</label>
                        <select id='destination' name='destination' value={destination} onChange={handleInput} required>
                            {options.map((option) => (
                                <option key={option} value={option} onClick={handleInput}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor='travelDate'>Flying Date</label>
                        <input type='date' value={travelDate} name='travelDate' onChange={handleInput} required />
                    </div>
                    <div>
                        <label htmlFor='arrivalTime'>Takeoff Time</label>
                        <input type='time' value={arrivalTime} name='arrivalTime' onChange={handleInput} required />
                    </div>
                    <div>
                        <label htmlFor='departureTime'>Landing Time</label>
                        <input type='time' value={departureTime} name='departureTime' onChange={handleInput} required />
                    </div>
                    <div>
                        <label htmlFor='price'>Fare</label>
                        <input type='number' value={price} name='price' onChange={handleInput} required />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}
