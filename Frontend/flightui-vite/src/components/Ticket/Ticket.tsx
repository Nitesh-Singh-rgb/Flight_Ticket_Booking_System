import React, { useRef, useMemo, useCallback, type JSX } from 'react';
import { useNavigate } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import printstyle from './Ticket.module.css';

interface Passenger {
  pid: string | number;
  pname: string;
  age: number | string;
  gender: string;
}

interface Flight {
  flightNumber: string;
  source: string;
  destination: string;
  travelDate: string;
  arrivalTime: string;
  departureTime: string;
}

interface Booking {
  flight: Flight;
  passengers: Passenger[];
}

interface TicketData {
  ticketNumber: string;
  total_pay: number;
  booking: Booking;
}

export default function Ticket(): JSX.Element {
  const history = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // All hooks called unconditionally at top level
  const reactToPrintfn = useReactToPrint({
    contentRef: contentRef,
  });

  // Read localStorage directly during render - no effect needed
  const ticketDataRaw = useMemo((): TicketData | null => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        history('/login');
        return null;
      }

      const storedTicket = localStorage.getItem('ticket');
      const viewTicket = localStorage.getItem('view-ticket');
      
      if (storedTicket) {
        return JSON.parse(storedTicket);
      } else if (viewTicket) {
        const ticket = JSON.parse(viewTicket);
        localStorage.removeItem('view-ticket');
        return ticket;
      }
      return null;
    } catch (error) {
      console.error('Error parsing ticket data:', error);
      return null;
    }
  }, [history]);

  // Derived state - no re-renders needed
  const passengers: Passenger[] = useMemo(() => 
    ticketDataRaw?.booking.passengers || [], 
    [ticketDataRaw]
  );

  // All useCallback hooks called unconditionally
  const renderPassengerNames = useCallback((): React.ReactNode => (
    passengers.map((psg: Passenger) => (
      <span key={psg.pid}>
        {psg.pname} <br />
      </span>
    ))
  ), [passengers]);

  const renderPassengerAges = useCallback((): React.ReactNode => (
    passengers.map((psg: Passenger) => (
      <span key={psg.pid}>
        {psg.age}
        <br />
      </span>
    ))
  ), [passengers]);

  const renderPassengerGenders = useCallback((): React.ReactNode => (
    passengers.map((psg: Passenger) => (
      <span key={psg.pid}>
        {psg.gender}
        <br />
      </span>
    ))
  ), [passengers]);

  // Early return AFTER all hooks
  if (!ticketDataRaw) {
    return <div className={printstyle.loading}>Loading ticket...</div>;
  }

  return (
    <div className={printstyle.main}>
      <div className={printstyle.container}>
        <div className={printstyle.btn_element}>
          <div>
            <button onClick={reactToPrintfn} className='btn'>
              Print The Ticket
            </button>
          </div>
        </div>
        <div style={{ padding: '12px' }}>
          <div className={printstyle.box} ref={contentRef}>
            <div className={printstyle.ticket}>
              <span className={printstyle.airline}>BookMyFlight.com</span>
              <span className={printstyle.boarding}>
                Boarding: {ticketDataRaw.booking.flight.source}
              </span>
              <div className={printstyle.content}>
                <span className={printstyle.jfk}>{ticketDataRaw.booking.flight.source}</span>
                <span className={printstyle.plane}>
                  <svg
                    clipRule="evenodd"
                    fillRule="evenodd"
                    height="60"
                    width="60"
                    imageRendering="optimizeQuality"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    viewBox="0 0 500 500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g stroke="#222">
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="30"
                        x1="300"
                        x2="55"
                        y1="390"
                        y2="390"
                      />
                      <path
                        d="M98 325c-9 10 10 16 25 6l311-156c24-17 35-25 42-50 2-15-46-11-78-7-15 1-34 10-42 16l-56 35 1-1-169-31c-14-3-24-5-37-1-10 5-18 10-27 18l122 72c4 3 5 7 1 9l-44 27-75-15c-10-2-18-4-28 0-8 4-14 9-20 15l74 63z"
                        fill="#222"
                        strokeLinejoin="round"
                        strokeWidth="10"
                      />
                    </g>
                  </svg>
                </span>
                <span className={printstyle.sfo}>
                  {ticketDataRaw.booking.flight.destination}
                </span>
                <div className={printstyle.subContent}>
                  <span className={printstyle.watermark}>BookMyFlight</span>
                  <span className={printstyle.name}>
                    Passenger Name
                    <br />
                    {renderPassengerNames()}
                  </span>
                  <span className={printstyle.age}>
                    Passenger Age
                    <br />
                    {renderPassengerAges()}
                  </span>
                  <span className={printstyle.gender}>
                    Passenger Gender
                    <br />
                    {renderPassengerGenders()}
                  </span>
                  <span className={printstyle.flight}>
                    Flight No.°
                    <br />
                    <span>{ticketDataRaw.booking.flight.flightNumber}</span>{" "}
                    <br />
                  </span>
                  <span className={printstyle.gate}>
                    Ticket No.° <br />
                    <span>{ticketDataRaw.ticketNumber}</span>
                  </span>
                  <span className={printstyle.amount}>
                    Amount Paid
                    <br />
                    <span>₹{ticketDataRaw.total_pay}</span>
                    <br />
                  </span>
                  <span className={printstyle.boardingtime}>
                    Departure Time
                    <br />
                    <span>{ticketDataRaw.booking.flight.arrivalTime}</span>
                  </span>
                  <span className={printstyle.traveldate}>
                    Travel Date
                    <br />
                    <span>{ticketDataRaw.booking.flight.travelDate}</span>
                  </span>
                  <span className={printstyle.departuretime}>
                    Arrival Time
                    <br />
                    <span>{ticketDataRaw.booking.flight.departureTime}</span>
                  </span>
                </div>
              </div>
              <div className={printstyle.barcode}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
