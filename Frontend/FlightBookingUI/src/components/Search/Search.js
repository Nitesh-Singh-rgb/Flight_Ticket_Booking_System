import { Component, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { HiLocationMarker, HiOutlineLocationMarker } from 'react-icons/hi'
import { RiAccountPinCircleLine } from 'react-icons/ri'
import { GoArrowBoth } from "react-icons/go";
import { RxCalendar } from 'react-icons/rx'
import FlightServiceRest from "../../services/FlightServiceRest";

import Aos from 'aos'
import 'aos/dist/aos.css'
import FlightList from './FlightList';


class Search extends Component {

    constructor(props) {
        super(props);
        this.service = new FlightServiceRest();
        this.flag = false;
        this.state = {
            flights: [],
            searched: false
        };
    }

    getFlightList = (values) => {
        this.setState({
            searched: false
        });
        const { source, destination, travelDate } = values;

        this.service.getFlightsForUser(source, destination, travelDate).then((date) => {
            if (date !== undefined && date.length > 0) {
                this.setState({
                    flights: date,
                    searched: true
                });
                // console.log(date);
            }
            else {
                alert("No Flight found!");
            }
        });
    };

    componentDidMount() {
        Aos.init({ duration: 2000 })
    }
    render() {
        return (
            <div className="search section container" >
                <div data-aos='fade-up' data-aos-duration='2500' className="sectionContainer" style={{ border: 'none' }}>

                    <Formik
                        initialValues={{
                            source: "",
                            destination: "",
                            travelDate: ""
                        }}

                        validationSchema={
                            Yup.object().shape(
                                {
                                    source: Yup.string().required("Source is required"),
                                    destination: Yup.string().required("Destination is required"),
                                    travelDate: Yup.date()
                                        .min(new Date(), "Travel Date must be later")
                                        .required("Travel Date is required"),
                                })}
                        onSubmit={(values) => this.getFlightList(values)}
                    >
                        {({ errors, touched }) => (

                            <Form data-aos='fade-up' data-aos-duration='2000' className="searchInputs flex">

                                <div className="singleInput flex">
                                    <label htmlFor="From" className="iconDiv">
                                        <HiLocationMarker className="icon" />
                                    </label>
                                    <div className="texts">
                                        <h4>From</h4>
                                        <Field as="select" name="source" id="From" style={{ border: 'none' }}>
                                            <option value="">Where from ?</option>
                                            <option value="Chennai">Chennai</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Kolkata">Kolkata</option>
                                            <option value="Goa">Goa</option>
                                            <option value="Pune">Pune</option>
                                            <option value="Jaipur" >Jaipur</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Cochin">Cochin</option>
                                            <option value="Ahmadabad">Ahmadabad</option>
                                        </Field>
                                        {errors.source && touched.source && (
                                            <div style={{ fontSize: '9px', padding: '3px' }}>{errors.source}</div>
                                        )}
                                        {/* <input type="text" placeholder='Where would you like to go?' /> */}
                                    </div>
                                </div>

                                <div className="singleInput flex">
                                    <label className="iconDiv" htmlFor="To">
                                        <HiOutlineLocationMarker className='icon' />
                                    </label>
                                    <div className="texts">
                                        <h4>To</h4>
                                        <Field as="select" name="destination" id="To" style={{ border: 'none' }}>
                                            <option value="">Where to ?</option>
                                            <option value="Chennai">Chennai</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Kolkata">Kolkata</option>
                                            <option value="Goa">Goa</option>
                                            <option value="Pune">Pune</option>
                                            <option value="Jaipur" >Jaipur</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Cochin">Cochin</option>
                                            <option value="Ahmadabad">Ahmadabad</option>
                                        </Field>
                                        {errors.destination && touched.destination && (
                                            <div style={{ fontSize: '9px', padding: '3px' }}>{errors.destination}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="singleInput flex">
                                    <label className="iconDiv">
                                        <RxCalendar className='icon' />
                                    </label>
                                    <div className="texts">
                                        <h4>Check In</h4>
                                        <Field type="date" name="travelDate"></Field>
                                        {errors.travelDate && touched.travelDate && (
                                            <div style={{ fontSize: '9px', padding: '3px' }}>{errors.travelDate}</div>
                                        )}
                                    </div>
                                </div>
                                <button type='submit' className='btn btnBlock flex'>Search Flights</button>
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
