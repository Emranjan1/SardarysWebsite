import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure path is correct based on your project structure
import './CustomerPage.css';

const CustomerPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Destructure to get the logout method from AuthContext

  const handleLogout = () => {
    logout(); // Use logout method from AuthContext
    navigate('/login');
  };

  return (
    <div className="customer-page">
      <h2>Customer Panel</h2>
      <div className="customer-options">
        <Link to="/orders" className="customer-button">View/Edit Orders</Link>
        <Link to="/profile/edit" className="customer-button">View/Edit Profile</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default CustomerPage;
