import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";

import Navbar from "./components/Navbar/Navbar";

import Subscribers from "./components/Subscribers/Subscribers";
import Login from './components/Login/Login';
import Register from './components/Register.js/Register';
import NoPage from './components/NoPage/NoPage';
import Booking from './components/Booking/Booking';

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            {/* <Route path='booking' element={<Booking />} /> */}
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>

    </main>
  );
}

export default App;
