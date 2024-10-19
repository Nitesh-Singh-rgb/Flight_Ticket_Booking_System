import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BookingService from '../../services/BookingService';
import { FaCcAmex, FaCcMastercard, FaCcVisa } from 'react-icons/fa6';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export default function Payment() {
    const [ticketNumber, setticketNumber] = useState(0);
    const [bokking_date, setBookingDate] = useState(0);
    const [total_pay, setTotalPay] = useState(0);
    const [name, setName] = useState('');
    const history = useNavigate();
    const service = new BookingService();

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history('/login');
        }
    }, [history]);

    const createTicket = (values) => {
        console.log(values.name);
        service.generateTicket(values)
            .then((response) => {
                console.log(response.data);
                if (response.status === 200) {
                    history('/ticket');
                }
            });
    };
    return (
        <div className='home'>
            <div>
                <h4>Confirm Payment</h4>
                <div>
                    <span><h6>CREDIT/DEBIT CARD</h6></span>
                </div>
                <div>
                    <FaCcMastercard />
                    <FaCcVisa />
                    <FaCcAmex />
                </div>
            </div>
            <Formik
                initialValues={{
                    cnumber: '',
                    exp: '',
                    cvc: '',
                    name: ''
                }}
                validationSchema={
                    Yup.object().shape({
                        cnumber: Yup.string().length(16, 'Card number must be 16 digits').required('Required'),
                        exp: Yup.string().required('Required'),
                        cvc: Yup.string().length(3, 'CVC must be 3 digits').required('Required'),
                        name: Yup.string().required('Required')
                    })
                }
                onSubmit={(values) => {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: 'You are about to make a payment!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, make the payment!',
                        cancelButtonText: 'No, cancel!',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            createTicket(values);
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire('Cancelled', 'Payment process was canceled :)', 'error');
                        }
                    });
                }}
            >
                {({ error, touched }) => (
                    <Form>
                        <div>
                            <label htmlFor='cc-number'>
                                CARD NUMBER
                            </label>
                            <Field name="cnumber" type="text" placeholder="**** **** **** ****" />
                            <ErrorMessage name='cnumber' component='div' />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='cc-exp'>
                                CARD EXPIRY
                            </label>
                            <Field name='exp' type='month' />
                            <ErrorMessage name='exp' component='div' />
                        </div>
                        <div>
                            <label htmlFor='cc-cvc'>
                                CARD CVV
                            </label>
                            <Field name='cvc' type='text' placeholder='***' />
                            <ErrorMessage name='cvc' component='div' />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='holder-name'>
                                CARD HOLDER NAME
                            </label>
                            <Field name='name' type='text' placeholder='Enter CardHolder name' />
                            < ErrorMessage name='name' component='div' />
                        </div>
                        <br />
                        <div>
                            <button type='submit'>Make Payment</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    )
}
