import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FlightServiceRest from '../../../services/FlightServiceRest';

interface Flight {
  fid: string;
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  availableSeats: number;
}

interface User {
  userId: string;
  username: string;
  isadmin?: number;
}

const UpdateFlight: React.FC = () => {
  // ALL useState calls FIRST - React Hooks Rules
  const navigate = useNavigate();
  const [fid, setFid] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('');
  const [arrivalTime, setArrivalTime] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [availableSeats, setAvailableSeats] = useState<string>('');
  
  const service = new FlightServiceRest();

  const getStoredUser = (): User | null => {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) as User : null;
    } catch {
      return null;
    }
  };

  const getStoredFlight = (): Flight | null => {
    try {
      const item = localStorage.getItem("flight");
      return item ? JSON.parse(item) as Flight : null;
    } catch {
      return null;
    }
  };

  // Load data synchronously AFTER all hooks
  const user = getStoredUser();
  const flight = getStoredFlight();
  
  // Initialize state with data
  React.useEffect(() => {
    if (user?.isadmin !== 1 || !flight) {
      navigate(user ? "/" : "/login");
      return;
    }
    
    setFid(flight.fid);
    setFlightNumber(flight.flightNumber);
    setSource(flight.source);
    setDestination(flight.destination);
    setTravelDate(flight.date);
    setArrivalTime(flight.arrivalTime);
    setDepartureTime(flight.departureTime);
    setPrice(flight.price.toString());
    setAvailableSeats(flight.availableSeats.toString());
  }, [flight, navigate, user]);

  const options: string[] = [
    'Chennai', 'Delhi', 'Mumbai', 'Kolkata', 'Goa', 
    'Pune', 'Jaipur', 'Bangalore', 'Cochin', 'Ahmadabad'
  ];

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    
    switch (name) {
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
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const flightData: Flight = {
      fid,
      flightNumber,
      source,
      destination,
      date: travelDate,
      arrivalTime,
      departureTime,
      price: parseFloat(price) || 0,
      availableSeats: parseInt(availableSeats) || 0
    };

    try {
      await service.updateFlight(flightData);
      alert("Your flight has been updated successfully!");
      navigate("/allFlights");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update flight. Please try again.");
    }
  };

  // Early return AFTER all hooks
  if (!user || user.isadmin !== 1 || !flight) {
    return <div>Loading...</div>; // Or spinner
  }

  return (
    <div className='home'>
      <div>
        <form onSubmit={onUpdate} id="updateForm">
          <h3>Update Flight Schedule</h3>
          
          <div>
            <label htmlFor='fid'>Flight ID</label>
            <input type='text' value={fid} name='fid' disabled />
          </div>
          
          <div>
            <label htmlFor='flightNumber'>Flight Number</label>
            <input type='text' value={flightNumber} name='flightNumber' disabled />
          </div>
          
          {/* Rest of form JSX remains same */}
          <div>
            <label htmlFor='source'>Source</label>
            <select id='source' name='source' value={source} onChange={handleInput} required>
              <option value="">Select Source</option>
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          {/* ... other fields ... */}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type='submit'>Update Flight</button>
            <button type='button' onClick={() => navigate('/allFlights')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFlight;
