import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingService from '../../services/BookingService';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import psg from './Passengers.module.css';
import Aos from 'aos';

const passengerSchema = Yup.object().shape({
    elements: Yup.array().of(
        Yup.object().shape({
            pname: Yup.string().min(3).required('Name is required'),
            gender: Yup.string().notOneOf(['Select'], 'Please select a gender').required('Gender is required'),
            age: Yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer').max(100, 'Plz! Enter valid age')
        }))
});

export default function Passengers() {
    const npsgn = localStorage.getItem("nop") ? parseInt(localStorage.getItem("nop")) : 1;
    const service = new BookingService();
    const history = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history('/login');
        }
        Aos.init({ duration: 2000 })
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
        <div className={psg.main}>
            <div className={psg.container} data-aos-duration='2000' data-aos='fade-up'>
                <h1 className={psg.form_title}>
                    Add Passenger Details
                </h1>
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
                                                                <td className={psg.row}>{elements.id = index + 1}</td>
                                                                <td className={psg.row}>
                                                                    <Field name={`elements[${index}].pname`} type="text" className={psg.my_label} />
                                                                    <ErrorMessage name={`elements[${index}].pname`} component="div" className={psg.error_msg} />
                                                                </td>
                                                                <td className={psg.row}>
                                                                    <Field name={`elements[${index}].gender`} as="select" className={psg.my_label}>
                                                                        <option value="Male">Male</option>
                                                                        <option value="Female">Female</option>
                                                                        <option value="Other">Other</option>
                                                                    </Field>
                                                                    <ErrorMessage name={`elements[${index}].gender`} component="div" className={psg.error_msg} />
                                                                </td>
                                                                <td className={psg.row}>
                                                                    <Field name={`elements[${index}].age`} type="number" className={psg.my_label} />
                                                                    <ErrorMessage name={`elements[${index}].age`} component="div" className={psg.error_msg} />
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (<div>No Passenger</div>)
                                                    }</tbody>)
                                            }
                                        />

                                    </table>
                                    <div className={psg.btn}>
                                        <button type='submit' className='btn'>Book Ticket</button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        </div>
    )
}



