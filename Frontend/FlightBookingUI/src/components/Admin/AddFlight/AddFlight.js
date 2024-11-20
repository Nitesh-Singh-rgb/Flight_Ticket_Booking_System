import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FlightServiceRest from '../../../services/FlightServiceRest';
import Swal from 'sweetalert2';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

export default function AddFlight() {
    const history = useNavigate();
    const service = new FlightServiceRest();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            history('/login');
        } else {
            if (JSON.parse(storedUser).isadmin !== 1) {
                history('/');
            }
        }
    }, [])

    const onSave = (values) => {
        const flight = { ...values };
        console.log(flight);
        service.saveFlight(flight);
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "The Flight has been added!"
        }).then(() => {
            history('/allFlights');
        });
    }

    return (
        <div className='home'>
            <div>
                <Formik
                    initialValues={{
                        source: "",
                        destination: "",
                        travelDate: "",
                        arrivalTime: "",
                        departureTime: "",
                        price: "",
                        availableSeats: ""
                    }}
                    validationSchema={
                        Yup.object().shape({
                            source: Yup.string().required("Source is required"),
                            destination: Yup.string().required("Destination is required"),
                            travelDate: Yup.date()
                                .min(new Date(), "Travel Date must be later")
                                .required("Travel Date is required"),
                            arrivalTime: Yup.string().required("Arrival Time is required"),
                            departureTime: Yup.string().required("Departure Time is required"),
                            price: Yup.number()
                                .typeError("Price must be a number")
                                .required("Price is required"),
                            availableSeats: Yup.number()
                                .typeError("Available Seats must be a number")
                                .required("Available Seats is required")
                        })
                    }
                    onSubmit={(values) => onSave(values)}
                >
                    <Form>
                        <h1>Add Flight Schedule</h1>
                        <div>
                            <div>
                                <label htmlFor='source'>Source</label>
                                <Field as="select" name="source">
                                    <option value="" disabled selected>Select Source</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Jaipur">Jaipur</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Cochin">Cochin</option>
                                    <option value="Ahmadabad">Ahmadabad</option>
                                </Field>
                                <ErrorMessage name="source" component="div" />
                            </div>
                            <div>
                                <label htmlFor="destination">Destination</label>
                                <Field as="select" name="destination">
                                    <option value="" disabled selected>
                                        Select Destination
                                    </option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Jaipur">Jaipur</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Cochin">Cochin</option>
                                    <option value="Ahmadabad">Ahmadabad</option>
                                </Field>
                                <ErrorMessage name="destination" component="div" />
                            </div>
                            <div>
                                <label htmlFor="travelDate">Flying Date</label>
                                <Field type="date" name="travelDate" />
                                <ErrorMessage name="travelDate" component="div" />
                            </div>
                            <div>
                                <label htmlFor="arrivalTime">Takeoff Time</label>
                                <Field type="time" name="arrivalTime" />
                                <ErrorMessage name="arrivalTime" component="div" />
                            </div>
                            <div>
                                <label htmlFor="departureTime">Landing Time</label>
                                <Field type="time" name="departureTime" />
                                <ErrorMessage name="departureTime" component="div" />
                            </div>
                            <div>
                                <label htmlFor="price">Fare</label>
                                <Field type="number" name="price" />
                                <ErrorMessage name="price" component="div" />
                            </div>
                            <div>
                                <label htmlFor="availableSeats">Available Seats</label>
                                <Field type="number" name="availableSeats" />
                                <ErrorMessage name="availableSeats" component="div" />
                            </div>
                        </div>
                        <div>
                            <button type='submit'>Submit</button>
                            <button type='reset'>Reset</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}
