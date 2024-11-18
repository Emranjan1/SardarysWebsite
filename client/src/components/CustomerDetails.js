import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correct path based on your project structure
import './CustomerDetails.css';

const CustomerDetails = () => {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authToken } = useAuth(); // Destructure to get authToken from AuthContext

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!authToken) {
        setError("Not authorized. No token available.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/customer-details', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'  // Instructs the browser to bypass the cache
          }
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setDetails(data);
        } else {
          const errorText = await response.text();
          console.error("Received HTML instead of JSON", errorText);
          throw new Error('Received invalid content-type, expected JSON');
        }
    
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [authToken]); // Include authToken in dependency array to re-fetch when token changes

  const handleNext = () => {
    navigate('/confirm-products');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="customer-details-container">
      <h2>Confirm Your Details</h2>
      <div className="customer-details">
        <p><strong>First Name:</strong> {details.firstName}</p>
        <p><strong>Last Name:</strong> {details.lastName}</p>
        <p><strong>Email:</strong> {details.email}</p>
        <p><strong>Phone:</strong> {details.phone}</p>
        <p><strong>Address Line 1:</strong> {details.addressLine1}</p>
        <p><strong>Address Line 2:</strong> {details.addressLine2}</p>
        <p><strong>Postal Code:</strong> {details.postalCode}</p>
        <p><strong>City:</strong> {details.city}</p>
        <p><strong>Country:</strong> {details.country}</p>
      </div>
      <button type="button" onClick={handleNext}>Continue to Payment</button>
    </div>
  );
};

export default CustomerDetails;
