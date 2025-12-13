import React, { type JSX } from 'react';
import { useNavigate } from 'react-router';
import BookingService from '../../services/BookingService';
import { FaCcAmex, FaCcMastercard, FaCcVisa } from 'react-icons/fa6';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import pay from './Payment.module.css';
import Aos from 'aos';

interface Ticket {
  passengerId: number;
  seatNumber: string;
  price: number;
  flightId: string;
}

interface PaymentFormValues {
  cnumber: string;
  exp: string;
  cvc: string;
  name: string;
}

const paymentSchema: Yup.ObjectSchema<PaymentFormValues> = Yup.object().shape({
  cnumber: Yup.string().length(16, 'Card number must be 16 digits').required('Required'),
  exp: Yup.string().required('Required'),
  cvc: Yup.string().length(3, 'CVC must be 3 digits').required('Required'),
  name: Yup.string().required('Required'),
});

export default function Payment(): JSX.Element {
  const history = useNavigate();
  const service = new BookingService();

  // Initialize AOS and check auth (external library sync)
  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      history('/login');
    }
    Aos.init({ duration: 2000 });
  }, [history]);

 const createTicket = async (values: PaymentFormValues): Promise<void> => {
  try {
    // Read data from localStorage to construct Ticket object
    const passengersRaw = localStorage.getItem('sid');
    const flightRaw = localStorage.getItem('plane');
    
    if (!passengersRaw || !flightRaw) {
      throw new Error('Missing passenger or flight data');
    }

    const passengers = JSON.parse(passengersRaw) as Array<{ pname: string; age: number; gender: string }>;
    const flight = JSON.parse(flightRaw) as {
      flightNumber: string; 
      flightId?: string; 
      price: number 
    };

    // Use payment values in ticket creation (cardholder name as passenger reference)
    // Create ticket for first passenger
    const ticket: Ticket = {
      passengerId: 1, // Use actual passenger ID or index
      seatNumber: 'A1', // Default or from seat selection
      price: flight.price,
      flightId: flight.flightId || flight.flightNumber,
    };

    // Log payment details for debugging
    console.log('Payment details:', {
      cardholder: values.name,
      cardNumber: values.cnumber.slice(-4), // Last 4 digits only
      passengersCount: passengers.length,
      totalAmount: flight.price * passengers.length
    });

    const response = await service.generateTicket(ticket);
    console.log('Ticket generated:', response.data);
    
    if (response.status === 200) {
      // Clear localStorage after successful ticket generation
      localStorage.removeItem('sid');
      localStorage.removeItem('plane');
      localStorage.removeItem('nop');
      
      history('/ticket');
    }
  } catch (error) {
    console.error('Ticket generation failed:', error);
    Swal.fire('Error', 'Failed to generate ticket. Please try again.', 'error');
  }
};


  const handleSubmit = (values: PaymentFormValues): void => {
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
  };

  return (
    <div className={pay.main}>
      <div className={pay.container} data-aos-duration="2000" data-aos='fade-up'>
        <div>
          <h4>Confirm Payment</h4>
          <div className={pay.card_icons}>
            <FaCcMastercard size={50} color='#1e366a' />
            <FaCcVisa size={50} color='#1434CB' />
            <FaCcAmex size={50} color='#016FD0' />
          </div>
        </div>
        <Formik
          initialValues={{
            cnumber: '',
            exp: '',
            cvc: '',
            name: ''
          }}
          validationSchema={paymentSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div>
                <label htmlFor='cc-number' className={pay.my_label}>
                  CARD NUMBER
                </label>
                <Field name="cnumber" type="text" placeholder="Enter Card Number" className={pay.text_bar} />
                <ErrorMessage name='cnumber' component='div' className={pay.error_msg} />
              </div>
              <br />
              <div>
                <label htmlFor='holder-name' className={pay.my_label}>
                  CARD HOLDER NAME
                </label>
                <Field name='name' type='text' placeholder='Enter CardHolder name' className={pay.text_bar} />
                <ErrorMessage name='name' component='div' className={pay.error_msg} />
              </div>
              <br />
              <div>
                <label htmlFor='cc-exp' className={pay.my_label}>
                  CARD EXPIRY
                </label>
                <Field name='exp' type='month' className={pay.text_bar} />
                <ErrorMessage name='exp' component='div' className={pay.error_msg} />
              </div>
              <br />
              <div>
                <label htmlFor='cc-cvc' className={pay.my_label}>
                  CARD CVV
                </label>
                <Field name='cvc' type='text' placeholder='***' className={pay.text_bar} />
                <ErrorMessage name='cvc' component='div' className={pay.error_msg} />
              </div>
              <br />
              <div className={pay.btn}>
                <button type='submit' className='btn'>Make Payment</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
