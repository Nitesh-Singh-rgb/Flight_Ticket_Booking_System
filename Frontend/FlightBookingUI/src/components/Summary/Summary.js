import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import sum from './Summary.module.css';
import Aos from 'aos';

export default function Summary() {
    const [summary, setSummary] = useState([]);
    const [airplane, setAirplane] = useState({});
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const history = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const
                    storedSummary = JSON.parse(localStorage.getItem('sid'));
                const storedAirplane = JSON.parse(localStorage.getItem('plane'));
                setSummary(storedSummary);
                setAirplane(storedAirplane);

                setAmount(storedSummary.length * storedAirplane.price);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        if (!localStorage.getItem('user')) {
            history("/login");
        } else {
            fetchData();
        }
        Aos.init({ duration: 2000 })
    }, []);

    const passList = summary.map((p) => (
        <tr key={p.pname}>
            <td>{p.pname}</td>
            <td>{p.age}</td>
            <td>{p.gender}</td>
        </tr>
    ));

    return (
        <div className={sum.main}>
            <div className="py-5" style={{ overflow: 'hidden', height: 'auto' }} data-aos-duration="2000" data-aos='fade-up'>
                <div className="col-lg-8 mx-auto text-center">
                    {/* <h1 className="display-6">Book My Flight</h1> */}
                </div>
                <div className="row">
                    <div className="container">
                        <h4 className={sum.h4}>Booking Summary</h4>
                        <br />
                        {isLoading && (<div>
                            <div role='status'><span>Loading...</span></div>
                        </div>)}
                        {error && (
                            <div>An error occurred: {error.message}</div>
                        )}
                        {summary.length > 0 && airplane && (
                            <>
                                <table className={sum.table}>
                                    <caption>Passenger Details</caption>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Gender</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {passList}
                                    </tbody>
                                </table><table className={sum.table}>
                                    <caption>Travelling Details</caption>
                                    <thead>
                                        <tr>
                                            <th>Flight No.</th>
                                            <th>Source</th>
                                            <th>Destination</th>
                                            <th>Travel Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{airplane.flightNumber}</td>
                                            <td>{airplane.source}</td>
                                            <td>{airplane.destination}</td>
                                            <td>{airplane.travelDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div>
                                    <span><strong>Amount to pay:</strong></span>
                                    <span style={{ color: 'green' }}><strong> ₹{amount}</strong></span>
                                </div>

                                <div className={sum.footer} data-aos-duration="2200" data-aos='fade-up'>
                                    <Link to="/payment">
                                        <button type="button" className="btn">
                                            Make Payment
                                        </button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
