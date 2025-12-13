import React, { useEffect, useRef, useState, useMemo, type JSX } from 'react';
import BookingService from '../../services/BookingService';
import { useNavigate } from 'react-router';
import booking from './Booking.module.css';
import Aos from 'aos';

interface FlightData {
  flightNumber: string;
  source: string;
  destination: string;
  travelDate: string;
}

interface BookingState {
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  passengers: number[];
}

interface BookingResponse {
  data: BookingResult[];
}

interface BookingResult {
  id: string | number;
  // Add other expected properties
}

export default function Booking(): JSX.Element {
  const history = useNavigate();
  const service = new BookingService();
  const [numberOfSeatsToBook, setNumberOfSeatsToBook] = useState<number>(1);
  const flight = useRef<FlightData | null>(null);

  // Read localStorage directly in render - no effect needed
  const flightDataRaw = React.useMemo(() => {
    try {
      const data = localStorage.getItem("plane");
      return data ? JSON.parse(data) as FlightData : null;
    } catch {
      return null;
    }
  }, []);

  // Derived state from localStorage data
  const state: BookingState = useMemo(() => ({
    flightNumber: flightDataRaw?.flightNumber || '',
    source: flightDataRaw?.source || '',
    destination: flightDataRaw?.destination || '',
    date: flightDataRaw?.travelDate || '',
    passengers: [1, 2, 3, 4, 5, 6],
  }), [flightDataRaw]);

  const flag = !!flightDataRaw;

  // Only AOS initialization and user auth check in effects
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData || JSON.parse(userData || 'null') === null) {
      history("/login");
    }
  }, [history]);

  // Redirect if no flight data on mount
  useEffect(() => {
    if (!flightDataRaw) {
      history("/");
    } else {
      flight.current = flightDataRaw;
    }
  }, [flightDataRaw, history]);

  const handleInput = (): void => {
    // No-op since inputs are readOnly
  };

  const goOnPassangers = (): void => {
    console.log(numberOfSeatsToBook);
    localStorage.setItem("nop", numberOfSeatsToBook.toString());
    service
      .addBooking(
        numberOfSeatsToBook,
        state.flightNumber,
        state.source,
        state.destination,
        state.date
      )
      .then((response: BookingResponse) => {
        if (response.data.length > 3) {
          // Handle error case - insufficient seats available
          console.error('Not enough seats available');
          // Could add user notification here
        } else {
          history("/passengers");
        }
      })
      .catch((error: unknown) => {
        console.error('Booking API error:', error);
      });
  };

  return (
    <div className={booking.booking_main}>
      <div className={booking.booking_container} data-aos-duration='2000' data-aos="fade-up">
        <div>
          <h1 className={booking.form_title}>Book your tickets</h1>
        </div>
        <div>
          <form className={booking.form}>
            <div>
              <label htmlFor='flightNumber' className={booking.my_label}>
                Flight Number
              </label>
              <input
                type="text"
                onChange={handleInput}
                value={state.flightNumber}
                name="flightNumber"
                readOnly
                disabled={!flag}
              />
            </div>
            <div>
              <label htmlFor='source' className={booking.my_label}>
                Flying from
              </label>
              <input
                type="text"
                onChange={handleInput}
                value={state.source}
                name="source"
                readOnly
                disabled={!flag}
              />
            </div>
            <div>
              <label htmlFor='destination' className={booking.my_label}>
                Flying to
              </label>
              <input
                type="text"
                onChange={handleInput}
                value={state.destination}
                name="destination"
                readOnly
                disabled={!flag}
              />
            </div>
            <div>
              <label htmlFor='date' className={booking.my_label}>
                Departing
              </label>
              <input
                type="text"
                onChange={handleInput}
                value={state.date}
                name="date"
                readOnly
                disabled={!flag}
              />
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor='noOfPsg' className={booking.my_label}>
                    Number of Passenger
                  </label>
                  {flag && state.passengers.length > 0 && (
                    <select
                      name='noOfPsg'
                      className="form-control"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setNumberOfSeatsToBook(Number(e.target.value))
                      }
                      value={numberOfSeatsToBook}
                    >
                      {state.passengers.map((psng: number) => (
                        <option key={psng} value={psng}>
                          {psng}
                        </option>
                      ))}
                    </select>
                  )}
                  <span className="select-arrow"></span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                onClick={goOnPassangers}
                type="button"
                className={booking.btn}
              >
                Book Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
