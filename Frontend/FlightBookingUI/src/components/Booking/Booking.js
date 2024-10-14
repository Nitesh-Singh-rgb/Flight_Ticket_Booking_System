import React, { Component, useEffect, useRef, useState } from 'react'
import BookingService from '../../services/BookingService';
import { useNavigate } from 'react-router-dom';

export default function Booking(props) {
    const history = useNavigate()
    const service = new BookingService()
    const flag = false;
    const flight = "";
    const [state, setState] = useRef([]);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("plane")) === null) {
            history("/");
        }
        else {
            flight = JSON.parse(localStorage.getItem("plane"))
            flag = true;
            state = {
                flightNumber: flight.flightNumber,
                source: flight.source,
                destination: flight.destination,
                date: flight.travelDate,
                passengers: [1, 2, 3, 4, 5, 6],
                numberOfSeatsToBook: 1,
            };
        }
    }, [])


    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("user"))) {
            history("/login")
        }
    })

    const handleInput = (event) => {
        setState({
            [event.target.name]: event.target.value
        });
    };

    const goOnPassangers = () => {
        console.log(state.numberOfSeatsToBook);
        localStorage.setItem("nop", state.numberOfSeatsToBook);
        service
            .addBooking(
                state.numberOfSeatsToBook,
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

    const change = (event) => {
        setState({ numberOfSeatsToBook: event.target.value });
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
                            {flag && (
                                <input
                                    type='text'
                                    onChange={handleInput}
                                    value={state.flightNumber}
                                    name='flightNumber'
                                    readOnly
                                />
                            )}
                        </div>
                        <div>
                            <h6>
                                <span>Flying from</span>
                            </h6>
                            {flag && (
                                <input
                                    type='text'
                                    onChange={handleInput}
                                    value={state.source}
                                    name='source'
                                />
                            )}
                        </div>
                        <div class="form-group">
                            <h6>
                                <span class="form-label">Flying to</span>
                            </h6>
                            {flag && (
                                <input
                                    class="form-control"
                                    type="text"
                                    onChange={handleInput}
                                    value={state.destination}
                                    name="destination"
                                    readOnly
                                />
                            )}
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <span class="form-label">Departing</span>
                                    {flag && (
                                        <input
                                            onChange={handleInput}
                                            value={state.date}
                                            class="form-control"
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <span class="form-label">
                                        Number of Passenger
                                    </span>
                                    {flag && (
                                        <select
                                            class="form-control"
                                            onChange={change}
                                            value={state.numberOfSeatsToBook}
                                        >
                                            {state.passengers.map((psng) => (
                                                <option value={psng}>{psng}</option>
                                            ))}
                                        </select>
                                    )}
                                    <span class="select-arrow"></span>
                                </div>
                            </div>
                        </div> */}
                        <div class="card-footer">
                            <button
                                onClick={goOnPassangers}
                                type="button"
                                class="subscribe btn btn-primary btn-block shadow-sm"
                            >
                                {" "}
                                Book Ticket
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

