import { useState } from 'react'
import { SiConsul } from 'react-icons/si'
import { AiOutlineGlobal } from 'react-icons/ai'
import { BsPhoneVibrate } from 'react-icons/bs'
import { CgMenuGridO } from 'react-icons/cg'
import logo from '../../assets/logo.png'
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Subscribers from '../Subscribers/Subscribers'
import Footer from '../Footer/Footer'

export default function Navbar() {

    const history = useNavigate();

    // remove navBar on small screens
    const [active, setActive] = useState('navBarMenu');
    const showNavBar = () => {
        setActive('navBarMenu showNavBar');
    }
    const removeNavBar = () => {
        setActive('navBarMenu');
    }

    // add bgcolor on second nabVar
    const [noBg, addBg] = useState('navBarTwo');
    const addBgColor = () => {
        if (window.scrollY >= 10) {
            addBg('navBarTwo navbar_With_Bg');
        } else {
            addBg('navBarTwo')
        }
    }
    window.addEventListener('scroll', addBgColor)

    const userClear = () => (
        localStorage.removeItem("user"),
        localStorage.removeItem("plane"),
        localStorage.removeItem("bid"),
        localStorage.removeItem("sid"),
        localStorage.removeItem("tickets"),
        localStorage.removeItem("nop"),
        localStorage.removeItem("ticket"),
        localStorage.clear()
    );

    const onTickets = () => {
        history('/ticket')
    };

    const loggedIn = (
        <div className='navBar flex'>
            <div className="navBarOne flex">
                <div>
                    <SiConsul className='icon' />
                </div>

                <div className="none flex">
                    <li className='flex'><BsPhoneVibrate className='icon' />Support</li>
                    <li className='flex'><AiOutlineGlobal className='icon' />Languages</li>
                </div>

                <div className="atb flex">
                    <span><Link to="/login">Sign In</Link></span>
                    <Link to="/register"><button className='btn flex btnTwo'>Register</button></Link>
                </div>

            </div>

            <div className={noBg}>
                <div className="logoDiv">
                    <img src={logo} className='logo' alt="logo" />
                </div>
                <div className={active}>
                    <ul className="menu flex">
                        <li onClick={removeNavBar} className="listItem"><Link to="/">Home</Link></li>
                        <li onClick={removeNavBar} className="listItem">About</li>
                        <li onClick={removeNavBar} className="listItem">Offers</li>
                        <li onClick={removeNavBar} className="listItem">Seats</li>
                        <li onClick={removeNavBar} className="listItem">Destinations</li>
                    </ul>
                    <button className='btn flex btnOne'>Contact</button>
                </div>
                <button className='btn flex btnTwo'>Contact</button>
                <div onClick={showNavBar} className="toggleIcon">
                    <CgMenuGridO className='icon' />
                </div>
            </div>
        </div>
    );

    const loggedOut = (
        <div className='navBar flex'>
            <div className="navBarOne flex">
                <div>
                    <SiConsul className='icon' />
                </div>

                <div className="none flex">
                    <li className='flex'><BsPhoneVibrate className='icon' />Support</li>
                    <li className='flex'><AiOutlineGlobal className='icon' />Languages</li>
                </div>

                <div className="atb flex">
                    <span></span>
                    <span>
                        <Link to="/">
                            <button className='btn flex btnTwo' onClick={userClear}>Sign Out</button>
                        </Link>
                    </span>
                </div>

            </div>

            <div className={noBg}>
                <div className="logoDiv">
                    <img src={logo} className='logo' alt="logo" />
                </div>
                <div className={active}>
                    <ul className="menu flex">
                        <li onClick={removeNavBar} className="listItem"><Link to="/">Home</Link></li>
                        <li onClick={removeNavBar} className="listItem">About</li>
                        <li onClick={removeNavBar} className="listItem">Offers</li>
                        <li onClick={removeNavBar} className="listItem">Seats</li>
                        <li onClick={removeNavBar} className="listItem">Destinations</li>
                    </ul>
                    <button className='btn flex btnOne'>Contact</button>


                </div>
                <button className='btn flex btnTwo'>Contact</button>
                <div onClick={showNavBar} className="toggleIcon">
                    <CgMenuGridO className='icon' />
                </div>
            </div>
        </div>
    );


    return (
        <>
            {localStorage.getItem("user") ? loggedOut : loggedIn}
            <Outlet />
            <Subscribers />
            <Footer />
        </>
    )
}
