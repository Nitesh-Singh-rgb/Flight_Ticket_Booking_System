import { render } from '@testing-library/react';
import { send } from 'emailjs-com';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import printstyle from './Ticket.module.css';

export default function Ticket() {
    const [ticket, setTicket] = useState({});
    const [passengers, setPassengers] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history('/login');
            return;
        }

        const storedTicket = JSON.parse(localStorage.getItem('ticket'));
        const viewTicket = JSON.parse(localStorage.getItem('view-ticket'));
        if (storedTicket) {
            setTicket(storedTicket);
            setPassengers(storedTicket.booking.passengers);
            // localStorage.removeItem('ticket');
        } else if (viewTicket) {
            setTicket(viewTicket);
            setPassengers(viewTicket.booking.passengers);
            localStorage.removeItem('view-ticket');
        }
    }, []);

    const onSeats = () => history('/seats');

    const onAlert = () => alert("Hooray! Thank you booking");

    const onMail = async () => {
        if (!ticket) return;

        const msg = `Your ticket is Confirmed with number: ${ticket.ticketNumber}`;
        const src = `Source: ${ticket.booking.flight.source}`;
        const dst = `Destination: ${ticket.booking.flight.destination}`;
        const travelDate = `Travel Date: ${ticket.booking.flight.travelDate}`;

        const tosend = {
            from_name: 'BookMyFlight.com',
            to_name: JSON.parse(localStorage.getItem('user')).fname,
            message: msg,
            source: src,
            destination: dst,
            travelDate: travelDate,
            reply_to: JSON.parse(localStorage.getItem('user')).email
        };
        try {
            const response = await send(
                'service_klk9enj',
                'template_y8s4lg9',
                tosend,
                'GP4TDJ8Lac5mrWKn5'
            );
            console.log('SUCCESS!', response.status, response.text);
            alert('Your ticket details has been emailed!');
            history('/');
        } catch (err) {
            console.log('FAILED...', err);
        }
    };

    const psg_name = passengers.map((psg) => {
        return (
            <span key={psg.pid}>
                {psg.pname} <br />
            </span>
        );
    });

    const psg_age = passengers.map((psg) => {
        return (
            <span key={psg.pid}>
                {psg.age}
                <br />
            </span>
        );
    });

    const psg_gender = passengers.map((psg) => {
        return (
            <span key={psg.pid}>
                {psg.gender}
                <br />
            </span>
        );
    });

    const contentRef = useRef(null);
    const reactToPrintfn = useReactToPrint({
        contentRef
    });

    return (
        <div style={{ height: '700px', paddingTop: '300px' }}>
            <div>
                <button onClick={reactToPrintfn}>
                    Print The Ticket
                </button>
            </div>
            <div>
                <button onClick={onMail}>
                    Mail My Ticket
                </button>
            </div>
            <div className={printstyle.box} ref={contentRef}>
                <div className={printstyle.ticket}>
                    <span className={printstyle.airline}>BookMyFlight.com</span>
                    <span className={printstyle.boarding}>
                        Boarding: {ticket?.booking?.flight?.source}
                    </span>
                    <div className={printstyle.content}>
                        <span className={printstyle.jfk}>{ticket?.booking?.flight?.source}</span>
                        <span className={printstyle.plane}>
                            <svg
                                clipRule="evenodd"
                                fillRule='evenodd'
                                height='60'
                                width='60'
                                imageRendering='optimizeQuality'
                                shapeRendering='geometricPrecision'
                                textRendering='geometricPrecision'
                                viewBox='0 0 500 500'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <g stroke='#222'>
                                    <line
                                        fill='none'
                                        strokeLinecap='round'
                                        strokeWidth='30'
                                        x1='300'
                                        x2='55'
                                        y1='390'
                                        y2='390'
                                    />
                                    <path
                                        d='M98 325c-9 10 10 16 25 6l311-156c24-17 35-25 42-50 2-15-46-11-78-7-15 1-34 10-42 16l-56 35 1-1-169-31c-14-3-24-5-37-1-10 5-18 10-27 18l122 72c4 3 5 7 1 9l-44 27-75-15c-10-2-18-4-28 0-8 4-14 9-20 15l74 63z'
                                        fill='#222'
                                        strokeLinejoin='round'
                                        strokeWidth='10'
                                    />
                                </g>
                            </svg>
                        </span>
                        <span className={printstyle.sfo}>
                            {ticket?.booking?.flight?.destination}
                        </span>
                        <div className={printstyle.subContent}>
                            <span className={printstyle.watermark}>BookMyFlight</span>
                            <span className={printstyle.name}>
                                Passenger Name
                                <br />
                                {psg_name}
                            </span>
                            <span className={printstyle.age}>
                                Passenger Age
                                <br />
                                {psg_age}
                            </span>
                            <span className={printstyle.gender}>
                                Passenger Gender
                                <br />
                                {psg_gender}
                            </span>
                            <span className={printstyle.flight}>
                                Flight No.&deg;
                                <br />
                                <span>{ticket?.booking?.flight?.flightNumber}</span>{" "}
                                <br />
                            </span>
                            <span className={printstyle.gate}>
                                Ticket No.&deg; <br />
                                <span>{ticket?.ticketNumber}</span>
                            </span>
                            <span className={printstyle.amount}>
                                Amount Paid
                                <br />
                                <span>₹{ticket?.total_pay}</span><br />
                            </span>
                            <span className={printstyle.boardingtime}>
                                Departure Time
                                <br />
                                <span>{ticket?.booking?.flight?.arrivalTime}</span>
                            </span>
                            <span className={printstyle.traveldate}>
                                Travel Date
                                <br />
                                <span>{ticket?.booking?.flight?.travelDate}</span>
                            </span>
                            <span className={printstyle.departuretime}>
                                Arrival Time
                                <br />
                                <span>{ticket?.booking?.flight?.departureTime}</span>
                            </span>
                        </div>
                    </div>
                    <div className={printstyle.barcode}></div>
                </div>
            </div>
        </div>
    )
}
