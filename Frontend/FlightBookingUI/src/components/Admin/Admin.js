import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import admin from './admin.module.css';

export default function Admin() {
    const history = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.isadmin === 0) {
            history('/');
        } else {
            setIsLoading(false);
        }
    }, []);
    return (
        <div className={admin.admin_main}>{isLoading ?
            (<div className={admin.loader_main}>
                <div className={admin.loader}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>) : (
                <div>
                    <div>
                        <div>
                            <img />
                            <div>
                                <h5>Welcome Admin</h5>
                                <p> "Unlock the skies and soar to new heights with our website's exhilarating flight simulation feature!"</p>
                                <p>You can Add schedules for Flights, Modify and Delete Schedules.</p>
                            </div>
                            <ul>
                                <li>
                                    <Link to='/addFlight'>
                                        Add Flight
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <img />
                            <div>
                                <h5>Welcome Captain Admin</h5>
                                <p>"Embark on thrilling airborne adventures with our website's all-inclusive flight simulations in just one line!"</p>
                                <p>You can View All flights Shedules and Modify and Delete Schedules.</p>
                            </div>
                            <ul>
                                <li>
                                    <Link to="/allFlights">All Flights</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <img />
                            <div>
                                <h5>Welcome</h5>
                                <p>"Access your User List effortlessly with a single click on our website."</p>
                                <p>You Can View All User List register on your website from Here easily.</p>
                            </div>
                            <ul>
                                <li>
                                    <Link to="/userlist">User List</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
