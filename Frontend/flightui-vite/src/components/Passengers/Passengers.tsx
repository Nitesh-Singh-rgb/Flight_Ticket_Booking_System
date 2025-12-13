import React, { useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router';
import BookingService from '../../services/BookingService';
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import psg from './Passengers.module.css';
import Aos from 'aos';

// Match BookingService Passenger interface exactly
interface Passenger {
  name: string;
  age: number;
  gender: string;
  passportNumber?: string;
}

interface FormValues {
  elements: Passenger[];
}

const passengerSchema: Yup.ObjectSchema<FormValues> = Yup.object().shape({
  elements: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
        gender: Yup.string().notOneOf([''], 'Please select a gender').required('Gender is required'),
        age: Yup.number()
          .required('Age is required')
          .positive('Age must be a positive number')
          .integer('Age must be an integer')
          .max(100, 'Please enter a valid age')
          .typeError('Age must be a number'),
      }) as Yup.ObjectSchema<Passenger>
    )
    .required()
    .min(1, 'At least one passenger is required'),
});

export default function Passengers(): JSX.Element {
  const npsgn: number = React.useMemo(() => {
    const nop = localStorage.getItem("nop");
    return nop ? parseInt(nop, 10) : 1;
  }, []);

  const service = new BookingService();
  const history = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      history('/login');
    }
    Aos.init({ duration: 2000 });
  }, [history]);

  const savePassenger = async (values: FormValues): Promise<void> => {
    try {
      // Transform form data to match BookingService Passenger interface
      const passengers: Passenger[] = values.elements.map((passenger) => ({
        name: passenger.name,
        age: Number(passenger.age),
        gender: passenger.gender,
      }));

      // Save to localStorage with original form structure
      localStorage.setItem('sid', JSON.stringify(values.elements));
      
      // Call API for each passenger (since API expects single Passenger)
      for (const passenger of passengers) {
        await service.addPassengers(passenger);
      }
      
      history("/summary");
    } catch (error) {
      console.error('Error saving passengers:', error);
    }
  };

  const initialValues: FormValues = React.useMemo(() => ({
    elements: Array(npsgn).fill({
      name: '',
      age: 0,
      gender: '',
    } as Passenger),
  }), [npsgn]);

  return (
    <div className={psg.main}>
      <div className={psg.container} data-aos-duration='2000' data-aos='fade-up'>
        <h1 className={psg.form_title}>Add Passenger Details</h1>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={passengerSchema}
            onSubmit={savePassenger}
          >
            {({ values }) => (
              <Form>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Age</th>
                    </tr>
                  </thead>
                  <FieldArray name="elements">
                    {() => (
                      <tbody>
                        {values.elements && values.elements.length > 0 ? (
                          values.elements.map((_passenger: Passenger, index: number) => (
                            <tr key={index}>
                              <td className={psg.row}>{index + 1}</td>
                              <td className={psg.row}>
                                <Field 
                                  name={`elements[${index}].name`} 
                                  type="text" 
                                  className={psg.my_label}
                                />
                                <ErrorMessage 
                                  name={`elements[${index}].name`} 
                                  component="div" 
                                  className={psg.error_msg} 
                                />
                              </td>
                              <td className={psg.row}>
                                <Field 
                                  name={`elements[${index}].gender`} 
                                  as="select" 
                                  className={psg.my_label}
                                >
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage 
                                  name={`elements[${index}].gender`} 
                                  component="div" 
                                  className={psg.error_msg} 
                                />
                              </td>
                              <td className={psg.row}>
                                <Field 
                                  name={`elements[${index}].age`} 
                                  type="number" 
                                  className={psg.my_label}
                                />
                                <ErrorMessage 
                                  name={`elements[${index}].age`} 
                                  component="div" 
                                  className={psg.error_msg} 
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>No Passengers</td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </FieldArray>
                </table>
                <div className={psg.btn}>
                  <button type="submit" className="btn">Book Ticket</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
