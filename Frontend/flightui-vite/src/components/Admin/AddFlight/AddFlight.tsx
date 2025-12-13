import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import FlightServiceRest from '../../../services/FlightServiceRest';
import Swal from 'sweetalert2';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

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

interface FlightFormValues {
  source: string;
  destination: string;
  travelDate: string;
  arrivalTime: string;
  departureTime: string;
  price: string;
  availableSeats: string;
}

const AddFlight: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Memoize service instance
  const service = useMemo(() => new FlightServiceRest(), []);

  const getStoredUser = useCallback((): User | null => {
    try {
      const item = localStorage.getItem('user');
      return item ? (JSON.parse(item) as User) : null;
    } catch {
      return null;
    }
  }, []);

  // Authentication check
  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate('/login');
    } else if (storedUser.isadmin !== 1) {
      navigate('/');
    }
  }, [getStoredUser, navigate]);

  const validationSchema = Yup.object().shape({
    source: Yup.string().required("Source is required"),
    destination: Yup.string().required("Destination is required"),
    travelDate: Yup.date()
      .min(new Date(), "Travel Date must be in the future")
      .required("Travel Date is required"),
    arrivalTime: Yup.string().required("Takeoff Time is required"),
    departureTime: Yup.string().required("Landing Time is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    availableSeats: Yup.number()
      .typeError("Available Seats must be a number")
      .min(1, "At least 1 seat required")
      .required("Available Seats is required")
  });

  const onSave = useCallback(async (values: FlightFormValues): Promise<void> => {
    try {
      setLoading(true);
      
      // Transform form values to complete Flight interface exactly matching backend
      const flight: Flight = {
        fid: `temp-${Date.now()}`, // Backend will override with real ID
        flightNumber: `FL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Backend will override
        source: values.source,
        destination: values.destination,
        date: values.travelDate,
        arrivalTime: values.arrivalTime,
        departureTime: values.departureTime,
        price: Number(values.price),
        availableSeats: Number(values.availableSeats)
      };
      
      console.log('Sending flight to backend:', flight);
      
      // Backend expects complete Flight and returns saved Flight
      const savedFlight: Flight = await service.saveFlight(flight);
      console.log('Flight saved successfully:', savedFlight);
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Flight ${savedFlight.flightNumber} added successfully!`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/allFlights');
      });
    } catch (error: unknown) {
    console.error('Failed to save flight:', error);
    
    // Type guard to safely access error.message
    let errorMessage = "Failed to add flight. Please try again.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: errorMessage,
      timer: 4000,
      timerProgressBar: true
    });
  }finally {
      setLoading(false);
    }
  }, [service, navigate]);

  const cities: string[] = [
    "Chennai", "Delhi", "Mumbai", "Kolkata", "Goa", 
    "Pune", "Jaipur", "Bangalore", "Cochin", "Ahmadabad"
  ];

  return (
    <div className='home' style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Formik
        initialValues={{
          source: "",
          destination: "",
          travelDate: "",
          arrivalTime: "",
          departureTime: "",
          price: "",
          availableSeats: ""
        }}
        validationSchema={validationSchema}
        onSubmit={onSave}
        enableReinitialize={true}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="p-fluid">
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Add Flight Schedule</h1>
            
            <div className="grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="source" className="font-bold block mb-2">Source *</label>
                <Field 
                  as="select" 
                  name="source" 
                  className="w-full p-inputtext p-component" 
                  disabled={loading}
                >
                  <option value="" disabled>Select Source</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Field>
                <ErrorMessage name="source" component="div" className="p-error mt-1" />
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="destination" className="font-bold block mb-2">Destination *</label>
                <Field 
                  as="select" 
                  name="destination" 
                  className="w-full p-inputtext p-component" 
                  disabled={loading}
                >
                  <option value="" disabled>Select Destination</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Field>
                <ErrorMessage name="destination" component="div" className="p-error mt-1" />
              </div>

              <div className="field col-12 md:col-4">
                <label htmlFor="travelDate" className="font-bold block mb-2">Flying Date *</label>
                <Field 
                  type="date" 
                  name="travelDate" 
                  className="w-full p-inputtext p-component" 
                  disabled={loading}
                />
                <ErrorMessage name="travelDate" component="div" className="p-error mt-1" />
              </div>

              <div className="field col-12 md:col-4">
                <label htmlFor="arrivalTime" className="font-bold block mb-2">Takeoff Time *</label>
                <Field 
                  type="time" 
                  name="arrivalTime" 
                  className="w-full p-inputtext p-component" 
                  disabled={loading}
                />
                <ErrorMessage name="arrivalTime" component="div" className="p-error mt-1" />
              </div>

              <div className="field col-12 md:col-4">
                <label htmlFor="departureTime" className="font-bold block mb-2">Landing Time *</label>
                <Field 
                  type="time" 
                  name="departureTime" 
                  className="w-full p-inputtext p-component" 
                  disabled={loading}
                />
                <ErrorMessage name="departureTime" component="div" className="p-error mt-1" />
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="price" className="font-bold block mb-2">Fare (₹) *</label>
                <Field 
                  type="number" 
                  name="price" 
                  className="w-full p-inputtext p-component" 
                  min="0" 
                  step="0.01" 
                  disabled={loading}
                />
                <ErrorMessage name="price" component="div" className="p-error mt-1" />
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="availableSeats" className="font-bold block mb-2">Available Seats *</label>
                <Field 
                  type="number" 
                  name="availableSeats" 
                  className="w-full p-inputtext p-component" 
                  min="1" 
                  disabled={loading}
                />
                <ErrorMessage name="availableSeats" component="div" className="p-error mt-1" />
              </div>
            </div>

            <div className="flex gap-2 justify-content-center mt-4">
              <button 
                type="submit" 
                disabled={isSubmitting || loading}
                className="p-button p-button-success p-button-raised"
              >
                {loading ? 'Saving...' : 'Submit'}
              </button>
              <button 
                type="button"
                onClick={() => resetForm()}
                disabled={isSubmitting || loading}
                className="p-button p-button-secondary p-button-outlined"
              >
                Reset
              </button>
              <button 
                type="button"
                onClick={() => navigate('/allFlights')}
                disabled={loading}
                className="p-button p-button-info p-button-outlined"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddFlight;
