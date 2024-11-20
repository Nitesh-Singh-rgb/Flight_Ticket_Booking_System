import React, { useEffect, useRef, useState } from 'react'
import FlightServiceRest from '../../../services/FlightServiceRest'
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
        

export default function FlightListAdmin() {
    const service = new FlightServiceRest();
    const history = useNavigate();
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            history('/login');
        } else if (JSON.parse(storedUser).isadmin === 1) {
            getFlights();
        } else {
            history('/');
        }
    }, [])

    const getFlights = () => {
        service.getFlight().then(data => {
            setFlights(data);
        })
    }

    const openNew = () => {
        history("/addFlight");
    }

    const calculateDuration = (f) => {
        const t1 = new Date('1970-01-01T' + f.departureTime + 'Z')
        const t2 = new Date('1970-01-01T' + f.arrivalTime + 'Z')
        let hour = t1.getUTCHours() - t2.getUTCHours()
        let min = t1.getUTCMinutes() - t2.getUTCMinutes();

        if (hour < 0) {
            hour = 12 + hour
        }
        if (min < 0) {
            min = 60 + min
        }

        return `${hour}hr ${min}min`;
    }

    const onDelete = (fid) => {
        if (window.confirm(`Are you sure you want to delete the flight ${fid} ?`)) {
            service.deleteFlight(fid).then((response) => {
                console.log(response)
                getFlights();
            });
        }
    }

    const onEdit = (flight) => {
        localStorage.setItem('flight', JSON.stringify(flight));
        history('/updateFlight');
    }

    const leftToolbarTemplate = () => {
        return (
            <div>
                <Button label='New' icon="pi pi-plus" severity='success' onClick={openNew} />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity='danger' onClick={() => onDelete(rowData.flightNumber)} />
            </React.Fragment>
        )
    }

    const durationTemplate = (rowData) => {
        return(
            calculateDuration(rowData)
        )
    }

    return (
        <div className='home'>
            <div>
                <h1>Flight List</h1>
                <div>
                    <div>
                        <Toolbar left={leftToolbarTemplate}></Toolbar>
                        <DataTable value={flights} dataKey="flightNumber">
                            <Column field='flightNumber' header='Flight Number'></Column>
                            <Column field='source' header='Source'></Column>
                            <Column field='destination' header='Destination'></Column>
                            <Column field='travelDate' header='Travel Date'></Column>
                            <Column field='arrivalTime' header="Takeoff Time"></Column>
                            <Column field='departureTime' header="Landing Time"></Column>
                            <Column field='Duration' header="Duration" body={durationTemplate}></Column>
                            <Column field='price' header="Fare" sortable></Column>
                            <Column field='availableSeats' header='Available Seats'></Column>
                            <Column body={actionBodyTemplate} exportable={false} ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}
