import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { Formik, Form, Field, type FormikProps } from "formik";
import * as Yup from "yup";
import { HiLocationMarker, HiOutlineLocationMarker } from 'react-icons/hi';
import { RxCalendar } from 'react-icons/rx';
import Aos from 'aos';
import 'aos/dist/aos.css';
import FlightServiceRest from '../../services/FlightServiceRest';

interface Flight {
  fid: string;
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  availableSeats: number;
  price: number;
}

interface SearchFormValues {
  source: string;
  destination: string;
  travelDate: string;
}

interface SearchState {
  flights: Flight[];
  searched: boolean;
}

interface FlightListProps {
  flights: Flight[];
}

const FlightList: React.FC<FlightListProps> = ({ flights }) => {
  return (
    <div>
      {flights.length > 0 ? (
        flights.map((flight) => (
          <div key={flight.fid}>
            {flight.flightNumber} - {flight.source} to {flight.destination}
          </div>
        ))
      ) : (
        <p>No flights found</p>
      )}
    </div>
  );
};

const validationSchema = Yup.object().shape({
  source: Yup.string().required("Source is required"),
  destination: Yup.string().required("Destination is required"),
  travelDate: Yup.date()
    .min(new Date(), "Travel Date must be later")
    .required("Travel Date is required")
    .nullable()
});

class Search extends Component<object, SearchState> {
  private service: FlightServiceRest;
  private flag: boolean = false;

  constructor(props: object) {
    super(props);
    this.service = new FlightServiceRest();
    this.state = {
      flights: [],
      searched: false
    };
  }

  getFlightList = async (values: SearchFormValues): Promise<void> => {
    this.setState({ searched: false });
    const { source, destination, travelDate } = values;

    try {
      const flights = await this.service.getFlightsForUser(source, destination, travelDate);
      if (flights && flights.length > 0) {
        this.setState({
          flights,
          searched: true
        });
      } else {
        alert("No Flight found!");
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
    }
  };

  componentDidMount(): void {
    Aos.init({ duration: 2000 });
  }

  render(): ReactNode {
    return (
      <div className="search section container">
        <div 
          data-aos='fade-up' 
          data-aos-duration='2500' 
          className="sectionContainer" 
          style={{ border: 'none' }}
        >
          <Formik<SearchFormValues>
            initialValues={{
              source: "",
              destination: "",
              travelDate: ""
            }}
            validationSchema={validationSchema}
            onSubmit={this.getFlightList}
          >
            {({ errors, touched }: FormikProps<SearchFormValues>) => (
              <Form data-aos='fade-up' data-aos-duration='2000' className="searchInputs flex">
                <div className="singleInput flex">
                  <label htmlFor="From" className="iconDiv">
                    <HiLocationMarker className="icon" />
                  </label>
                  <div className="texts">
                    <h4>From</h4>
                    <Field 
                      as="select" 
                      name="source" 
                      id="From" 
                      style={{ border: 'none' }}
                    >
                      <option value="">Where from?</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Goa">Goa</option>
                      <option value="Pune">Pune</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Cochin">Cochin</option>
                      <option value="Ahmadabad">Ahmadabad</option>
                    </Field>
                    {errors.source && touched.source && (
                      <div style={{ fontSize: '9px', padding: '3px' }}>
                        {errors.source}
                      </div>
                    )}
                  </div>
                </div>

                <div className="singleInput flex">
                  <label className="iconDiv" htmlFor="To">
                    <HiOutlineLocationMarker className='icon' />
                  </label>
                  <div className="texts">
                    <h4>To</h4>
                    <Field 
                      as="select" 
                      name="destination" 
                      id="To" 
                      style={{ border: 'none' }}
                    >
                      <option value="">Where to?</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Goa">Goa</option>
                      <option value="Pune">Pune</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Cochin">Cochin</option>
                      <option value="Ahmadabad">Ahmadabad</option>
                    </Field>
                    {errors.destination && touched.destination && (
                      <div style={{ fontSize: '9px', padding: '3px' }}>
                        {errors.destination}
                      </div>
                    )}
                  </div>
                </div>

                <div className="singleInput flex">
                  <label className="iconDiv">
                    <RxCalendar className='icon' />
                  </label>
                  <div className="texts">
                    <h4>Check In</h4>
                    <Field type="date" name="travelDate" />
                    {errors.travelDate && touched.travelDate && (
                      <div style={{ fontSize: '9px', padding: '3px' }}>
                        {errors.travelDate}
                      </div>
                    )}
                  </div>
                </div>
                
                <button type='submit' className='btn btnBlock flex'>
                  Search Flights
                </button>
              </Form>
            )}
          </Formik>
        </div>
        {this.state.searched && <FlightList flights={this.state.flights} />}
      </div>
    );
  }
}

export default Search;
