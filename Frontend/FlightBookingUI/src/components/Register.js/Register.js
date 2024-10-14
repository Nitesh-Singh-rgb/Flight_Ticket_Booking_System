import React from 'react';
import * as Yup from 'yup';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { send } from 'emailjs-com';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
    fname: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
        .required("Mobile Number is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    cpasswd: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm Password is required")
});

export default function Register(props) {
    const service = new UserService();
    let history = useNavigate()

    const onMail = (values) => {
        let uname = "User Name :- " + values.username;
        let pwd = "Password :-" + values.password;

        let tosend = {
            from_name: "FlightTicket.com",
            User_Name: uname,
            to_name: values.fname,
            Password: pwd,
            reply_to: values.email
        };

        send("service_eexh9ep", "template_2ds0hza", tosend, "FJwieaplawIPTWw51")
            .then((response) => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "User registered successfully and your details have been sent to your registered email Id!"
                });
            })
            .catch((err) => {
                console.log("FAILED...", err);
            });
    };

    return (
        <div className='home'>
            <div>
                <div>
                    <div>
                        <h1>
                            <b>Registration</b>
                        </h1>
                    </div>
                </div>
                <div>
                    <Formik initialValues={{
                        fname: "",
                        email: "",
                        phone: "",
                        username: "",
                        password: "",
                        cpasswd: ""
                    }}
                        validationSchema={RegisterSchema}
                        onSubmit={(values) => {
                            onMail(values);
                            service
                                .addUser(values)
                                .then((response) => {
                                    if (response.status === 200) {
                                        console.log(response.data);
                                        history('/login/')
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                    alert("Registration failed");
                                });
                        }}
                    >
                        {({ values, isSubmitting, errors, touched, handleChange }) => (
                            <Form>
                                <div>
                                    <h6>
                                        <span>Name</span>
                                    </h6>
                                    <Field
                                        type="text"
                                        name="fname"
                                        placeholder="Enter Your Full Name"
                                    />
                                    <ErrorMessage name='fname' component="div" />
                                </div>
                                <div>
                                    <h6>
                                        <span>Email</span>
                                    </h6>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Enter Your Email"
                                    />
                                    <ErrorMessage name='email' component="div" />
                                </div>
                                <div>
                                    <h6>
                                        <span>Mobile Number</span>
                                    </h6>
                                    <Field
                                        name="phone"
                                        pattern="[6-9][0-9]{9}"
                                        maxLength="10"
                                    />
                                    <ErrorMessage name='phone' component="div" />
                                </div>
                                <div>
                                    <h6>
                                        <span >Username</span>
                                    </h6>
                                    <Field
                                        type="text"
                                        name="username"
                                        placeholder="Enter Your Username"
                                    />
                                    <ErrorMessage name='username' component="div" />
                                </div>
                                <div>
                                    <h6>
                                        <span>Password</span>
                                    </h6>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Enter your Password"
                                    />
                                    <ErrorMessage name='password' component="div" />
                                </div>
                                <div>
                                    <h6>
                                        <span >Confirm Password</span>
                                    </h6>
                                    <Field
                                        type="password"
                                        name="cpasswd"
                                        onChange={handleChange}
                                        placeholder="Enter Confirm Password"
                                    />
                                    {errors.cpasswd && touched.cpasswd && (
                                        <div>{errors.cpasswd}</div>
                                    )}
                                </div>
                                <div>
                                    <button
                                        type='submit'
                                    >
                                        <h2>Register</h2>
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <div>
                <div><Link to="/login"><button type='button'>Already registered? Login Now!</button></Link></div>
            </div>
        </div>
    )
}
