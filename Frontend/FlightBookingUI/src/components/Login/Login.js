import React from 'react';
import * as Yup from 'yup';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

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
        <div className='home'>
            <div >
                <div className='row'>
                    <div>
                        <div>Login</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
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
                                                        <div className='form-group'>
                                                            <h6>
                                                                <span className='form-label'>Username</span>
                                                            </h6>
                                                            <Field
                                                                type="text"
                                                                name="username"
                                                                placeholder="Enter your Username"
                                                                className="form-control"
                                                            />
                                                            <ErrorMessage
                                                                name='username'
                                                                component="div"
                                                                className='text-danger'
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <h6>
                                                                <span className='form-label'>Password</span>
                                                            </h6>
                                                            <Field
                                                                type="password"
                                                                name="password"
                                                                placeholder="Enter your Password"
                                                                className="form-control"
                                                            />
                                                            <ErrorMessage
                                                                name='password'
                                                                component="div"
                                                                className='text-danger'
                                                            />
                                                        </div>
                                                        <div className='card-footer'>
                                                            <button
                                                                type='submit'
                                                            >Login</button>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Link className='card-link' to="/register">
                                            <button type='button'>
                                                New User? Register Now!
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <Link to="/forgetPassword">
                                            <button type='button'>
                                                Forget-Password
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
