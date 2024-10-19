import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    }, []);

    const passList = summary.map((p) => (
        <tr key={p.pname}>
            <td>{p.pname}</td>
            <td>{p.age}</td>
            <td>{p.gender}</td>
        </tr>
    ));

    return (
        <div className="home">
            <div className="py-5" style={{ overflow: 'hidden', height: 'auto' }}>
                <div className="row mb-4">
                    <div className="col-lg-8 mx-auto text-center">

                        {/* <h1 className="display-6">Book My Flight</h1> */}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 mx-auto">
                        <div className="card ">
                            <div className="card-header">
                                <div className="bg-white shadow-sm pt-4 pl-2 pr-2 pb-2">
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active pt-3">
                                            <div className="container">
                                                <h4 align="center">Booking Summary</h4>

                                                <br />
                                                {isLoading && (<div>
                                                    <div role='status'><span>Loading...</span></div>
                                                </div>)}
                                                {error && (
                                                    <div>An error occurred: {error.message}</div>
                                                )}
                                                {summary.length > 0 && airplane && (
                                                    <>
                                                        <table className="table">
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

                                                            <thead><tr><th>Travelling Details</th></tr></thead>
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
                                                            <tfoot>
                                                                <tr>
                                                                    <td><strong>Amount to pay</strong></td>
                                                                    <td></td>
                                                                    <td><strong>₹{amount}</strong></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                        <div className="card-footer">
                                                            <Link to="/payment">
                                                                <button type="button" className="subscribe btn btn-primary btn-block shadow-sm">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
