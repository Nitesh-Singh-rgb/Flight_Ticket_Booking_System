import React from 'react';
import * as Yup from 'yup';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { send } from 'emailjs-com';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import register from './Register.module.css';

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
        <div className={register.register_main}>
            <div>
                <div className={register.register_container}>
                    <div>
                        <h1 className={register.h1}>Create an account</h1>
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
                                    <div className={register.space}>
                                        <label className={register.my_label} htmlFor='fname'>Name</label>
                                        <Field
                                            type="text"
                                            name="fname"
                                            placeholder="Enter Your Full Name"
                                            className={register.form_control}
                                        />
                                        <ErrorMessage name='fname' component="div" className={register.error_msg} />
                                    </div>
                                    <div className={register.space}>
                                        <label className={register.my_label} htmlFor='email'>Email</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Enter Your Email"
                                            className={register.form_control}
                                        />
                                        <ErrorMessage name='email' component="div" className={register.error_msg} />
                                    </div>
                                    <div className={register.space}>
                                        <label className={register.my_label} htmlFor='phone'>Mobile No.</label>
                                        <Field
                                            name="phone"
                                            pattern="[6-9][0-9]{9}"
                                            maxLength="10"
                                            placeholder="Enter Mobile No."
                                            className={register.form_control}
                                        />
                                        <ErrorMessage name='phone' component="div" className={register.error_msg}/>
                                    </div>
                                    <div className={register.space}>
                                        <label className={register.my_label} htmlFor='username'>Username</label>
                                        <Field
                                            type="text"
                                            name="username"
                                            placeholder="Enter Your Username"
                                            className={register.form_control}
                                        />
                                        <ErrorMessage name='username' component="div" className={register.error_msg} />
                                    </div>
                                    <div className={register.space}>
                                        <label className={register.my_label} htmlFor='password'>Password</label>
                                        <Field
                                            type="password"
                                            name="password"
                                            placeholder="Enter your Password"
                                            className={register.form_control}
                                        />
                                        <ErrorMessage name='password' component="div" className={register.error_msg}/>
                                    </div>
                                    <div className={register.space}>
                                        <label className={register.my_label} htmlFor='cpasswd'>Confirm Password</label>
                                        <Field
                                            type="password"
                                            name="cpasswd"
                                            onChange={handleChange}
                                            placeholder="Enter Confirm Password"
                                            className={register.form_control}
                                        />
                                        {errors.cpasswd && touched.cpasswd && (
                                            <div className={register.error_msg}>{errors.cpasswd}</div>
                                        )}
                                    </div>
                                    <div>
                                        <button type='submit' className='btn' style={{width:'100%'}}>
                                            Register
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className={register.register_link}>
                    Already registered?
                    <Link to="/login"> Login Now!</Link>
                </div>
            </div>
        </div>
    )
}
