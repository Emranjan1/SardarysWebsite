import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Assuming useAuth is properly set up to manage auth state
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: 'London',
    country: 'United Kingdom',
    password: '',
    confirmPassword: ''
  });
  const { login } = useAuth(); // Assuming login function updates the global auth state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
        setError('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
        return;
    }

    try {
        const { confirmPassword, ...userData } = formData;
        console.log("Sending data to server:", userData); // Log data being sent to the server
        const response = await registerUser(userData);
        console.log("Response from server:", response); // Log response from the server
        if (response.token) {
            login(response.token, response.userDetails); // Assuming these are returned from successful registration
            navigate('/customer'); // Navigate to the customer page on successful registration
        }
    } catch (err) {
        console.log("Error during registration:", err); // Log any errors that occur
        if (err && err.data && err.data.message) {
            setError(err.data.message); // More specific error handling
        } else {
            setError('Registration failed. Please try again.'); // General error message
        }
    }
};

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line 1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2"
          value={formData.addressLine2}
          onChange={handleChange}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          value="London"
          readOnly
        />
        <input
          type="text"
          name="country"
          value="United Kingdom"
          readOnly
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
