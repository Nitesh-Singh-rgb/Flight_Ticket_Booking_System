import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import register from './Register.module.css';

interface UserFormValues {
  fname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  cpasswd: string;
}


const RegisterSchema = Yup.object().shape({
  fname: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
    .required("Mobile Number is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  cpasswd: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match") // Remove null completely
    .required("Confirm Password is required")
});


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Memoize service instance
  const service = useMemo(() => new UserService(), []);

  const onSubmit = useCallback(async (values: UserFormValues): Promise<void> => {
    try {
      setLoading(true);
      
      // Register user with backend
      const response = await service.addUser(values);
      
      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User registered successfully! Please login with your credentials.",
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: errorMessage,
        timer: 4000,
        timerProgressBar: true
      });
    } finally {
      setLoading(false);
    }
  }, [service, navigate]);

  return (
    <div className={register.register_main}>
      <div>
        <div className={register.register_container}>
          <div>
            <h1 className={register.h1}>Create an account</h1>
          </div>
          <div>
            <Formik<UserFormValues>
              initialValues={{
                fname: "",
                email: "",
                phone: "",
                username: "",
                password: "",
                cpasswd: ""
              }}
              validationSchema={RegisterSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className={register.space}>
                    <label className={register.my_label} htmlFor="fname">Name</label>
                    <Field
                      type="text"
                      name="fname"
                      placeholder="Enter Your Full Name"
                      className={register.form_control}
                      disabled={loading}
                    />
                    <ErrorMessage name="fname" component="div" className={register.error_msg} />
                  </div>

                  <div className={register.space}>
                    <label className={register.my_label} htmlFor="email">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className={register.form_control}
                      disabled={loading}
                    />
                    <ErrorMessage name="email" component="div" className={register.error_msg} />
                  </div>

                  <div className={register.space}>
                    <label className={register.my_label} htmlFor="phone">Mobile No.</label>
                    <Field
                      name="phone"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      placeholder="Enter Mobile No."
                      className={register.form_control}
                      disabled={loading}
                    />
                    <ErrorMessage name="phone" component="div" className={register.error_msg} />
                  </div>

                  <div className={register.space}>
                    <label className={register.my_label} htmlFor="username">Username</label>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Enter Your Username"
                      className={register.form_control}
                      disabled={loading}
                    />
                    <ErrorMessage name="username" component="div" className={register.error_msg} />
                  </div>

                  <div className={register.space}>
                    <label className={register.my_label} htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter your Password"
                      className={register.form_control}
                      disabled={loading}
                    />
                    <ErrorMessage name="password" component="div" className={register.error_msg} />
                  </div>

                  <div className={register.space}>
                    <label className={register.my_label} htmlFor="cpasswd">Confirm Password</label>
                    <Field
                      type="password"
                      name="cpasswd"
                      placeholder="Enter Confirm Password"
                      className={register.form_control}
                      disabled={loading}
                    />
                    <ErrorMessage name="cpasswd" component="div" className={register.error_msg} />
                  </div>

                  <div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || loading}
                      className="btn" 
                      style={{ width: '100%' }}
                    >
                      {loading ? 'Registering...' : 'Register'}
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
  );
};

export default Register;
