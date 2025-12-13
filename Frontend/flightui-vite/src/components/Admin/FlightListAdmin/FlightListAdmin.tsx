import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import FlightServiceRest from '../../../services/FlightServiceRest';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';

interface Flight {
  fid: string;
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  price: number;
  availableSeats: number;
}

interface User {
  userId: string;
  username: string;
  isadmin?: number;
}

const FlightListAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Memoize service instance to prevent recreation on every render
  const service = useMemo(() => new FlightServiceRest(), []);

  const getStoredUser = useCallback((): User | null => {
    try {
      const item = localStorage.getItem('user');
      return item ? (JSON.parse(item) as User) : null;
    } catch {
      return null;
    }
  }, []);

  const getFlights = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const data: Flight[] = await service.getFlight();
      setFlights(data);
    } catch (error: unknown) {
      console.error('Failed to fetch flights:', error);
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Authentication check
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    if (!storedUser || storedUser.isadmin !== 1) {
      if (!storedUser) {
        navigate('/login');
      } else {
        navigate('/');
      }
    }
  }, [getStoredUser, navigate]);

  // Fetch flights when user is authenticated
  useEffect(() => {
    if (user && user.isadmin === 1) {
      getFlights();
    }
  }, [getFlights, user]);

  const openNew = useCallback((): void => {
    navigate("/addFlight");
  }, [navigate]);

  const calculateDuration = useCallback((flight: Flight): string => {
    try {
      const [depHours, depMins] = flight.departureTime.split(':').map(Number);
      const [arrHours, arrMins] = flight.arrivalTime.split(':').map(Number);
      
      const depDate = new Date(flight.date);
      depDate.setHours(depHours, depMins, 0, 0);
      
      const arrDate = new Date(flight.date);
      arrDate.setHours(arrHours, arrMins, 0, 0);
      
      // Handle overnight flights
      let diffMs = arrDate.getTime() - depDate.getTime();
      if (diffMs < 0) {
        arrDate.setDate(arrDate.getDate() + 1);
        diffMs = arrDate.getTime() - depDate.getTime();
      }
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}hr ${mins}min`;
    } catch {
      return 'N/A';
    }
  }, []);

  const onDelete = useCallback(async (fid: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete flight ${fid}?`)) {
      try {
        await service.deleteFlight(fid);
        getFlights();
      } catch (error: unknown) {
        console.error('Delete failed:', error);
        alert('Failed to delete flight');
      }
    }
  }, [getFlights, service]);

  const onEdit = useCallback((flight: Flight): void => {
    localStorage.setItem('flight', JSON.stringify(flight));
    navigate('/updateFlight');
  }, [navigate]);

  const leftToolbarTemplate = useCallback((): ReactNode => (
    <div className="flex flex-column gap-2">
      <Button 
        label="New" 
        icon="pi pi-plus" 
        severity="success" 
        onClick={openNew} 
      />
    </div>
  ), [openNew]);

  const actionBodyTemplate = useCallback((rowData: Flight): ReactNode => (
    <React.Fragment>
      <Button 
        icon="pi pi-pencil" 
        rounded 
        outlined 
        size="small"
        tooltip="Edit" 
        onClick={() => onEdit(rowData)} 
        className="mr-2"
      />
      <Button 
        icon="pi pi-trash" 
        rounded 
        outlined 
        severity="danger" 
        size="small"
        tooltip="Delete"
        onClick={() => onDelete(rowData.fid)} 
      />
    </React.Fragment>
  ), [onEdit, onDelete]);

  const durationTemplate = useCallback((rowData: Flight): ReactNode => (
    <span>{calculateDuration(rowData)}</span>
  ), [calculateDuration]);

  const priceBodyTemplate = useCallback((rowData: Flight): ReactNode => (
    <span>₹{rowData.price.toLocaleString()}</span>
  ), []);

  // Loading or unauthorized state
  if (!user || user.isadmin !== 1 || loading) {
    return (
      <div className="home" style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Flight List (Admin)</h1>
        <Toolbar left={leftToolbarTemplate} />
        <DataTable 
          value={flights} 
          dataKey="fid"
          emptyMessage="No flights found"
          tableStyle={{ minWidth: '50rem' }}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} flights"
          size="small"
          loading={loading}
        >
          <Column field="fid" header="Flight ID" sortable style={{ minWidth: '120px' }} />
          <Column field="flightNumber" header="Flight Number" sortable style={{ minWidth: '140px' }} />
          <Column field="source" header="Source" sortable style={{ minWidth: '120px' }} />
          <Column field="destination" header="Destination" sortable style={{ minWidth: '120px' }} />
          <Column field="date" header="Travel Date" sortable style={{ minWidth: '140px' }} />
          <Column field="departureTime" header="Takeoff Time" sortable style={{ minWidth: '130px' }} />
          <Column field="arrivalTime" header="Landing Time" sortable style={{ minWidth: '130px' }} />
          <Column header="Duration" body={durationTemplate} style={{ minWidth: '110px' }} />
          <Column header="Fare (₹)" body={priceBodyTemplate} sortable style={{ minWidth: '120px' }} />
          <Column field="availableSeats" header="Available Seats" sortable style={{ minWidth: '140px' }} />
          <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '140px' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default FlightListAdmin;
