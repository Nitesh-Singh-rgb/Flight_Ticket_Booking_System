import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import 'primereact/resources/themes/md-light-indigo/theme.css'
import './flightlist.css';
import Aos from 'aos'
import 'aos/dist/aos.css'
import React from 'react'

export default function FlightList(props) {
    const [flights, setFlights] = useState(null);
    const [selectedflight, setSelectedflight] = useState(null);

    useEffect(() => {
        setFlights(() => props.flights)
        Aos.init({ duration: 2000 })
    }, []);

    const header = (
        <h4>Scheduled flight</h4>
    );

    const footer = (
        <footer style={{ textAlign: 'left', fontSize: '90%', fontStyle: 'italic' }}>In total there are {flights ? flights.length : 0} Flights.</footer>
    );

    const onRowSelect = (event) => {
        console.log(event.data)
    }

    if (!flights) {
        return null;
    }
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }} data-aos-duration='2000' data-aos='fade-up'>
            <DataTable value={flights} header={header} footer={footer} tableStyle={{ minWidth: '50rem', padding: '10px' }} selectionMode={'single'} selection={selectedflight} onSelectionChange={(e) => setSelectedflight(e.value)} dataKey='flightNumber' metaKeySelection={true} onRowSelect={onRowSelect}>
                <Column field='flightNumber' header='Flight Number' className='Column'></Column>
                <Column field='source' header='Source' className='Column' ></Column>
                <Column field='destination' header='Destination' className='Column'></Column>
                <Column field='travelDate' header="Travel Date" className='Column'></Column>
                <Column field='arrivalTime' header='Takeoff Time' className='Column'></Column>
                <Column field='departureTime' header='Landing Time' className='Column' ></Column>
                <Column field='price' header='Fare' sortable className='Column'></Column>
                <Column field='availableSeats' header='Available Seats' className='Column'></Column>
            </DataTable>
        </div >
    )
}


