import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Subscribers from "./components/Subscribers/Subscribers";
import Login from './components/Login/Login';
import Register from './components/Register.js/Register';
import NoPage from './components/NoPage/NoPage';
import Booking from './components/Booking/Booking';
import Passengers from './components/Passengers/Passengers';
import Summary from './components/Summary/Summary';
import Payment from './components/Payment/Payment';
import Ticket from './components/Ticket/Ticket';
import Admin from './components/Admin/Admin';
import AddFlight from './components/Admin/AddFlight/AddFlight';
import FlightListAdmin from './components/Admin/FlightListAdmin/FlightListAdmin';
import UpdateFlight from './components/Admin/UpdateFlight/UpdateFlight';
import UserList from './components/Admin/Userlist/UserList';
import Tickets from './components/Tickets/Tickets';



function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='admin' element={<Admin />} />
            <Route path='register' element={<Register />} />
            <Route path='booking' element={<Booking />} />
            <Route path='passengers' element={<Passengers />} />
            <Route path='tickets' element={<Tickets />} />
            <Route path='addFlight' element={<AddFlight />} />
            <Route path='allFlights' element={<FlightListAdmin />} />
            <Route path='updateFlight' element={<UpdateFlight />} />
            <Route path='userlist' element={<UserList />} />
            <Route path='summary' element={<Summary />} />
            <Route path="payment" element={<Payment />} />
            <Route path='ticket' element={<Ticket />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>

    </main>
  );
}

export default App;
