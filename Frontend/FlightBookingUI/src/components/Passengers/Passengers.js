import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingService from '../../services/BookingService';

export default function Passengers() {

    const history = useNavigate();
    const service = new BookingService();
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
            history.push('/login');
        } else {
            const service = new BookingService();
        }
    }, []);

    return (
        <div>Passengers
            {state.npsgn}
        </div>

    )
}
