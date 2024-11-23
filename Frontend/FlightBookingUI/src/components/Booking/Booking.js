import React, { Component, useEffect, useRef, useState } from 'react'
import BookingService from '../../services/BookingService';
import { useNavigate } from 'react-router-dom';
import booking from './Booking.module.css';
import Aos from 'aos';


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
        Aos.init({ duration: 2000 });
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
        <div className={booking.booking_main}>
            <div className={booking.booking_container} data-aos-duration='2000' data-aos="fade-up">
                <div >
                    <h1 className={booking.form_title}>Book your tickets</h1>
                </div>
                <div>
                    <form className={booking.form} >
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
                                    {flag && (state.passengers && state.passengers.length > 0) && (
                                        < select
                                            name='noOfPsg'
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
                                className={booking.btn}
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

