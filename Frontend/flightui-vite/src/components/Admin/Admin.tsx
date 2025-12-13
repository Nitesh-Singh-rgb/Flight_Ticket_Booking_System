import React from 'react';
import { Link, useNavigate } from 'react-router'; 
import admin from './admin.module.css';

interface User {
  userId: string;
  username: string;
  isadmin?: number;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();

  const getStoredUser = (): User | null => {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) as User : null;
    } catch {
      return null;
    }
  };

  // Check auth synchronously on render
  const user = getStoredUser();
  if (!user || user.isadmin !== 1) {
    navigate('/');
    return null; // Prevent render during navigation
  }

  return (
    <div className={admin.admin_main}>
      <div>
        <div>
          <div>
            <img alt="Admin dashboard" />
            <div>
              <h5>Welcome Admin</h5>
              <p>"Unlock the skies and soar to new heights with our website's exhilarating flight simulation feature!"</p>
              <p>You can Add schedules for Flights, Modify and Delete Schedules.</p>
            </div>
            <ul>
              <li><Link to="/addFlight">Add Flight</Link></li>
            </ul>
          </div>

          <div>
            <img alt="Flight management" />
            <div>
              <h5>Welcome Captain Admin</h5>
              <p>"Embark on thrilling airborne adventures with our website's all-inclusive flight simulations in just one line!"</p>
              <p>You can View All flights Schedules and Modify and Delete Schedules.</p>
            </div>
            <ul>
              <li><Link to="/allFlights">All Flights</Link></li>
            </ul>
          </div>

          <div>
            <img alt="User management" />
            <div>
              <h5>Welcome</h5>
              <p>"Access your User List effortlessly with a single click on our website."</p>
              <p>You Can View All User List register on your website from Here easily.</p>
            </div>
            <ul>
              <li><Link to="/userlist">User List</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
