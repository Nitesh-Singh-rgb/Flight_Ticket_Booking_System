import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BookingService from '../../services/BookingService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const history = useNavigate();
    const service = new BookingService();

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history("/");
        } else {
            fetchTickets();
        }
    }, []);

    const fetchTickets = () => {
        service.getTickets().then((response) => {
            const storedTickets = JSON.parse(localStorage.getItem('tickets')) || [];
            const updatedTickets = response.data.map((ticket) => {
                const storedTicket = storedTickets.find((t) => t.ticketNumber === ticket.ticketNumber);
                ticket.booking.status = storedTicket?.booking.status || 'YES';
                return ticket;
            });
            setTickets(updatedTickets);
        })
    };

    const showTicket = (x) => {
        localStorage.setItem('view-ticket', JSON.stringify(x));
        history('/ticket');
    }

    const cancelBooking = (ticket) => {
        const updatedTickets = tickets.map((t) => {
            if (t.ticketNumber === ticket.ticketNumber) {
                t.booking.status = 'NO';
            }
            return t;
        });
        setTickets(updatedTickets);

        const storedTickets = JSON.parse(localStorage.getItem('tickets')) || [];
        const updatedStoredTickets = storedTickets.map((t) => {
            if (t.ticketNumber === ticket.ticketNumber) {
                t.booking.status = 'NO';
            }
            return t;
        });
        localStorage.setItem('tickets', JSON.stringify(updatedStoredTickets));
    }

    const detailsTemplate = (rowData) => {
        return (
            <button onClick={() => showTicket(rowData)}>View Ticket</button>
        )
    }

    const actionTemplate = (rowData) => {
        return (
            <div>
                {rowData.booking.status === 'YES' && (
                    <button onClick={() => cancelBooking(rowData)} disabled={rowData.booking.status === 'NO'} > Cancel</button>
                )}
            </div>
        )
    }


    return (
        <div className='home'>
            <div>
                <h1>My Bookings</h1>
            </div>
            <DataTable value={tickets}>
                <Column field='ticketNumber' header="Ticket Number"></Column>
                <Column field="booking.flight.source" header="Source"></Column>
                <Column field="booking.flight.destination" header="Destination"></Column>
                <Column field="booking.flight.travelDate" header="Travel Date"></Column>
                <Column field="booking.bookingDate" header="Booking Date"></Column>
                <Column field='booking.status' header="Booking Status"></Column>
                <Column body={actionTemplate} header="Action"></Column>
                <Column body={detailsTemplate} header="Details"></Column>
            </DataTable>
        </div>
    )
}
