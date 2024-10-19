import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingService from '../../services/BookingService';
import * as Yup from 'yup';

const passengerSchema = Yup.object().shape(
    {
        pname: Yup.string().min(3).required('Name is required'),
        gender: Yup.string().notOneOf(['Select'], 'Please select a gender').required('Gender is required'),
        age: Yup.number().required('Age is required').positive('Age must be a positive number').integer('Age must be an integer')
    }
);

export default function Passengers() {

    const [npsgn, setNpsgn] = useState(parseInt(localStorage.getItem("nop")));
    const [values, setValues] = useState([]);
    const [info, setInfo] = useState(false);
    const [btn, setBtn] = useState(false);
    const [gen, setGen] = useState(['Select', 'Male', 'Female', 'Other']);
    const service = new BookingService();
    const history = useNavigate();
    const [state, setState] = useState({
        npsgn: !localStorage.getItem("nop") ? 1 : parseInt(localStorage.getItem("nop")),
        pname: '',
        gen: ['Select', 'Male', 'Female', 'Other'],
        gender: '',
        age: '',
        id: 1,
        btn: false,
        info: false
    });

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            history('/login');
        }
    }, []);

    const areFieldsFilled = () => {
        return state.pname !== '' && state.gender !== 'Select' && state.age !== '';
    }

    const handleClick = (idx) => {
        setValues([...values, { id: values.length + 1, pname: values.pname, gender: values.gender, age: values.age }]);
        setInfo(true);
        if (values.length === npsgn && !areFieldsFilled()) {
            setBtn(true);
        }
    };

    const fieldArray = Array.from({ length: npsgn }, (_, i) => (
        <tr key={i}>
            <td>
                <input
                    type='text'
                    name='pname'
                    onChange={(e) => {
                        setValues([...values, { ...values[i], pname: e.target.value }]);
                        setInfo(false);
                    }}
                />
            </td>
            <td>
                <select name='gender' onChange={(e) => {
                    setValues([...values, { ...values[i], gender: e.target.value }]);
                }}>
                    {gen.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </td>
            <td>
                <input
                    type='text'
                    name='age'
                    onChange={(e) => {
                        setValues([...values, { ...values[i], age: e.target.value }]);
                    }}
                    maxLength="2"
                />
            </td>
            <td align='center'>
                <button
                    disabled={btn || areFieldsFilled()}
                    onClick={() => handleClick(i)}
                >
                    Add Passenger
                </button>
            </td>
        </tr>
    ));


    const savePassenger = () => {
        console.log("Values save: ", values);
        localStorage.setItem('sid', JSON.stringify(values));
        service.addPassengers({ "pass1": values })
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
                            <strong>Note: </strong> Please add passengers individually
                        </div>
                        <div>
                            <div>
                                {state.info && <div>
                                    <strong>Success!</strong>&nbsp; Passenger added with name : &nbsp; {state.pname}
                                </div>}
                                <div>
                                    <form>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Gender</th>
                                                    <th>Age</th>
                                                    <th>Add Passenger</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fieldArray}
                                            </tbody>
                                        </table>
                                        <div>
                                            <button className='btn' onClick={savePassenger} type='button'>Book Ticket</button>
                                        </div>
                                    </form>
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



