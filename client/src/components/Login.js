import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../services/api'; // Make sure this is correctly imported
import {jwtDecode} from 'jwt-decode'; // Correct the import if it's a default export
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Ensure the path is correct

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Ensure login handles token setting and user details internally

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    try {
      const response = await loginUser({ email, password });
      const { token } = response;  // Assume your API returns an object with a token

      if (!token) {
        throw new Error("No token provided.");  // Handle case where no token is returned
      }

      login(token);  // Updated login method to accept token and manage user details
      const decoded = jwtDecode(token);  // Assuming jwtDecode is correctly imported and used

      // Redirect based on the role decoded from the token
      const redirectPath = location.state?.from?.pathname || (decoded.isAdmin ? '/adminpanel' : '/profile');
      navigate(redirectPath, { replace: true });  // Using replace to avoid going back to login page on back button
    } catch (err) {
      console.error("Login error:", err);  // Print the error to console
      setError(err.message || 'Login failed. Please try again.');  // More specific error message if available
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
