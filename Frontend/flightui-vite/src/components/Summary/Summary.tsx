import React, { useMemo, type JSX } from 'react';
import { Link, useNavigate } from 'react-router';
import sum from './Summary.module.css';
import Aos from 'aos';

interface Passenger {
  pname: string;
  age: number | string;
  gender: string;
}

interface Airplane {
  flightNumber: string;
  source: string;
  destination: string;
  travelDate: string;
  price: number;
}

export default function Summary(): JSX.Element {
  const history = useNavigate();

  // Read localStorage directly during render - no state/effects needed
  const summaryData = useMemo((): {
    passengers: Passenger[];
    airplane: Airplane | null;
    amount: number;
    hasError: boolean;
    isLoading: boolean;
  } => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        history('/login');
        return { passengers: [], airplane: null, amount: 0, hasError: false, isLoading: true };
      }

      const storedSummaryRaw = localStorage.getItem('sid');
      const storedAirplaneRaw = localStorage.getItem('plane');

      if (!storedSummaryRaw || !storedAirplaneRaw) {
        return { passengers: [], airplane: null, amount: 0, hasError: true, isLoading: false };
      }

      const passengers: Passenger[] = JSON.parse(storedSummaryRaw);
      const airplane: Airplane = JSON.parse(storedAirplaneRaw);
      const amount: number = passengers.length * airplane.price;

      return {
        passengers,
        airplane,
        amount,
        hasError: false,
        isLoading: false,
      };
    } catch (error) {
      console.error('Error parsing summary data:', error);
      return { passengers: [], airplane: null, amount: 0, hasError: true, isLoading: false };
    }
  }, [history]);

  // Initialize AOS only once
  React.useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const passList = useMemo((): React.ReactNode => (
    summaryData.passengers.map((p: Passenger) => (
      <tr key={p.pname}>
        <td>{p.pname}</td>
        <td>{p.age}</td>
        <td>{p.gender}</td>
      </tr>
    ))
  ), [summaryData.passengers]);

  if (summaryData.isLoading) {
    return (
      <div className={sum.main}>
        <div className="py-5" style={{ overflow: 'hidden', height: 'auto' }}>
          <div role='status'>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (summaryData.hasError || !summaryData.airplane) {
    return (
      <div className={sum.main}>
        <div className="py-5" style={{ overflow: 'hidden', height: 'auto' }}>
          <div>An error occurred while loading summary data</div>
        </div>
      </div>
    );
  }

  return (
    <div className={sum.main}>
      <div className="py-5" style={{ overflow: 'hidden', height: 'auto' }} data-aos-duration="2000" data-aos='fade-up'>
        <div className="col-lg-8 mx-auto text-center">
          <div className="container">
            <h4 className={sum.h4}>Booking Summary</h4>
            <br />
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
            </table>
            <table className={sum.table}>
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
                  <td>{summaryData.airplane.flightNumber}</td>
                  <td>{summaryData.airplane.source}</td>
                  <td>{summaryData.airplane.destination}</td>
                  <td>{summaryData.airplane.travelDate}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <span><strong>Amount to pay:</strong></span>
              <span style={{ color: 'green' }}><strong> ₹{summaryData.amount}</strong></span>
            </div>
            <div className={sum.footer} data-aos-duration="2200" data-aos='fade-up'>
              <Link to="/payment">
                <button type="button" className="btn">
                  Make Payment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
