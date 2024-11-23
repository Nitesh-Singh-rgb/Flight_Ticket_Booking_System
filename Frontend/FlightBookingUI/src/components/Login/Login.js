import React from 'react';
import * as Yup from 'yup';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import login from './Login.module.css';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required")
});

export default function Login(props) {
    const history = useNavigate()

    const service = new UserService();

    const handleSubmit = (values) => {
        service
            .validateUser(values.username, values.password)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    if (response.data.isadmin === 0)
                        history("/booking");
                    else
                        history("/admin");
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid username or password."
                });
            });
    };

    return (
        <div className={login.login_main}>
            <div>
                <div className={login.login_container}>
                    <h1 className={login.h1}>Login</h1>
                    <div>
                        <Formik initialValues={{
                            username: "",
                            password: ""
                        }}
                            validationSchema={LoginSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className={login.form_group}>
                                        <label className={login.my_label}>Username</label>
                                        <Field
                                            type="text"
                                            name="username"
                                            placeholder="Enter your Username"
                                            className={login.form_control}
                                        />
                                        <ErrorMessage
                                            name='username'
                                            component="div"
                                            className={login.error_msg}
                                        />
                                    </div>
                                    <div className={login.form_group}>
                                        <label className={login.my_label}>Password</label>
                                        <Field
                                            type="password"
                                            name="password"
                                            placeholder="Enter your Password"
                                            className={login.form_control}
                                        />
                                        <ErrorMessage
                                            name='password'
                                            component="div"
                                            className={login.error_msg}
                                        />
                                    </div>
                                    <div>
                                        <div className={login.remember_forgot}>
                                            <Link to="/forgetPassword">
                                                Forget-Password
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='card-footer'>
                                        <button type='submit' className='btn' style={{ width: '100%' }}>Login</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className={login.signup_link}>
                    New User?
                    <Link className='card-link' to="/register">
                        <a href='#'>
                            Register Now!
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}
