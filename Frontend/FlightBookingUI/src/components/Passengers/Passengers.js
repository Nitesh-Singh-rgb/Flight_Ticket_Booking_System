import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingService from '../../services/BookingService';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';

const passengerSchema = Yup.object().shape({
    elements: Yup.array().of(
        Yup.object().shape({
            pname: Yup.string().min(3).required('Name is required'),
            gender: Yup.string().notOneOf(['Select'], 'Please select a gender').required('Gender is required'),
            age: Yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer').max(100, 'Plz! Enter valid age')
        })
    )
});

export default function Passengers() {

    const npsgn = localStorage.getItem("nop") ? parseInt(localStorage.getItem("nop")) : 1;
    const service = new BookingService();
    const history = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history('/login');
        }
    }, []);

    const savePassenger = (v) => {
        // console.log(v);
        // setValues(v.elements);
        // console.log("Values save: ", values);
        localStorage.setItem('sid', JSON.stringify(v.elements));
        service.addPassengers({ "pass1": v.elements })
            .then(() => history("/summary"));
    };

    return (
        <div className='home'>
            <h1>
                Add Passenger Details
            </h1>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <Formik
                                        initialValues={{
                                            elements: Array(npsgn).fill({
                                                id: '',
                                                pname: '',
                                                gender: 'Male',
                                                age: ''
                                            })
                                        }}
                                        validationSchema={passengerSchema}
                                        onSubmit={savePassenger}
                                    >
                                        {
                                            ({ values }) => (
                                                <Form>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th> </th>
                                                                <th>Name</th>
                                                                <th>Gender</th>
                                                                <th>Age</th>
                                                            </tr>
                                                        </thead>

                                                        <FieldArray
                                                            name='elements'
                                                            render={arrayHelpers => (
                                                                <tbody>
                                                                    {values.elements && values.elements.length > 0 ? (
                                                                        values.elements.map((elements, index) => (
                                                                            <tr key={index}>
                                                                                {elements.id = index + 1}
                                                                                <td><Field name={`elements[${index}].pname`} type="text" /><ErrorMessage name={`elements[${index}].pname`} component="div" /></td>
                                                                                <td><Field name={`elements[${index}].gender`} as="select">
                                                                                    <option value="Male">Male</option>
                                                                                    <option value="Female">Female</option>
                                                                                    <option value="Other">Other</option>
                                                                                </Field>
                                                                                    <ErrorMessage name={`elements[${index}].gender`} component="div" /></td>
                                                                                <td><Field name={`elements[${index}].age`} type="number" /><ErrorMessage name={`elements[${index}].age`} component="div" /></td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (<div>No Passenger</div>)
                                                                    }</tbody>)
                                                            }
                                                        />


                                                    </table>
                                                    <button type='submit' className='btn'>Book Ticket</button>
                                                </Form>
                                            )
                                        }
                                    </Formik>
                                    {/* <div className="modal fade" id="myModal">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">


                                                <div className="modal-header">
                                                    <h4 className="modal-title">Post COVID-19 Conditions of Carriage</h4>
                                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                </div>


                                                <div className="modal-body">
                                                    1. As per Government of India directive “vulnerable persons such as very elderly, pregnant ladies, passengers with health issues are advised to avoid air travel”
                                                    <br></br>
                                                    2. Passengers to familiarize and follow the social distancing norms as required at the airport premises.
                                                    <br></br>
                                                    3. Entry into the airport terminal will be permitted only with suitable PPE, at least with a face mask.
                                                    <br></br>
                                                    4. Follow all self sanitisation norms, as applicable, at the airport.
                                                    <br></br>
                                                    5. In case any symptoms of COVID-19, passengers may be debarred from entry into the airport or air travel by appropriate authorities.

                                                </div>


                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



