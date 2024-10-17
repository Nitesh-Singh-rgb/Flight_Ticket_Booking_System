import React, { Component, useEffect, useRef, useState } from 'react'
import BookingService from '../../services/BookingService';
import { useNavigate } from 'react-router-dom';

export default function Booking(props) {
    const history = useNavigate();
    const service = new BookingService();
    const [flag, setflag] = useState(false);
    const [state, setState] = useState({
        flightNumber: '',
        source: '',
        destination: '',
        date: '',
        passengers: [1, 2, 3, 4, 5, 6],
    });
    const [numberOfSeatsToBook, setNumberOfSeatsToBook] = useState(1);
    const flight = useRef(null);

    useEffect(() => {
        try {
            const flightData = JSON.parse(localStorage.getItem("plane"));
            if (flightData !== null) {
                flight.current = flightData;
                setflag(true);
                setState({
                    ...state,
                    flightNumber: flight.current.flightNumber,
                    source: flight.current.source,
                    destination: flight.current.destination,
                    date: flight.current.travelDate,
                });
            } else {
                history("/"); // Redirect to login or error page if no flight data found
            }
        } catch (error) {
            console.error("Error retrieving flight data:", error);
            // Handle
        }
    }, []);


    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("user"))) {
            history("/login")
        }
    }, [history])

    const handleInput = (event) => {
        setState({
            [event.target.name]: event.target.value
        });
    };

    const goOnPassangers = () => {
        console.log(numberOfSeatsToBook);
        localStorage.setItem("nop", numberOfSeatsToBook);
        service
            .addBooking(
                numberOfSeatsToBook,
                state.flightNumber,
                state.source,
                state.destination,
                state.date
            )
            .then((response) => {
                if (response.data.length > 3) {

                }
                else {
                    history("/passengers");
                }
            });
    };

    return (
        <div className='home'>
            <div>
                <div>
                    <div>
                        <h1>Book My Flight</h1>
                    </div>
                </div>
                <div>
                    <form>
                        <div>
                            <h6>
                                <span>Flight Number</span>
                            </h6>
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
                            <h6>
                                <span>Flying from</span>
                            </h6>
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
                            <h6>
                                <span>Flying to</span>
                            </h6>
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
                            <h6>
                                <span>Departing</span>
                            </h6>
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
                                    <span className="form-label">
                                        Number of Passenger
                                    </span>
                                    {flag && (state.passengers && state.passengers.length > 0) && (
                                        < select
                                            className="form-control"
                                            onChange={e => setNumberOfSeatsToBook(e.target.value)}
                                            value={numberOfSeatsToBook}
                                        >{

                                                state.passengers.map((psng) => (
                                                    <option key={psng} value={psng}>{psng}</option>
                                                ))
                                            }
                                        </select>)
                                    }
                                    <span className="select-arrow"></span>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                onClick={goOnPassangers}
                                type="button"
                                className="subscribe btn btn-primary btn-block shadow-sm"
                            >
                                {" "}
                                Book Ticket
                            </button>
                        </div>
                    </form>

                </div>
            </div >
        </div >
    )
}

