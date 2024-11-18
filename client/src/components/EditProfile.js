import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCustomerDetails, saveCustomerDetails } from '../services/api'; // Ensure you import the saving function
import EditCustomerDetailModal from './EditCustomerDetailModal'; // Import the modal component
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth(); // Access authToken directly from context
  const [userDetailsState, setUserDetailsState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: '',
  });
  const [error, setError] = useState('');  // To hold potential error messages
  const [isEditing, setIsEditing] = useState(false); // State to control modal visibility

  useEffect(() => {
    const loadUserDetails = async () => {
      if (!authToken) {
        navigate('/login');
        return;
      }
      try {
        const details = await fetchCustomerDetails(); // Fetch details from API
        setUserDetailsState(details);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('Failed to load user data');
      }
    };
  
    loadUserDetails();
  }, [navigate, authToken]);

  const handleEdit = () => {
    setIsEditing(true); // Open modal for editing
  };

  const handleSaveChanges = async (details) => {
    try {
      await saveCustomerDetails(details); // Save the updated details via API
      setUserDetailsState(details); // Update local state with new details
      setIsEditing(false); // Close the modal
    } catch (error) {
      console.error('Failed to save user details:', error);
      setError('Failed to save user data');
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false); // Close the modal without saving changes
  };

  return (
    <div className="edit-profile-page">
      <h2>View/Edit Profile</h2>
      {error && <p className="error">{error}</p>}
      <div className="user-details">
        <p>First Name: {userDetailsState.firstName}</p>
        <p>Last Name: {userDetailsState.lastName}</p>
        <p>Email: {userDetailsState.email}</p>
        <p>Phone: {userDetailsState.phone}</p>
        <p>Address 1: {userDetailsState.addressLine1}</p>
        <p>Address 2: {userDetailsState.addressLine2}</p>
        <p>Postal Code: {userDetailsState.postalCode}</p>
        <p>City: {userDetailsState.city}</p>
        <p>Country: {userDetailsState.country}</p>
        <button onClick={handleEdit}>Edit</button>
      </div>
      <Link to="/profile" className="back-button">Back</Link>
      {isEditing && (
        <EditCustomerDetailModal
          CustomerDetails={userDetailsState}
          onSave={handleSaveChanges}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default EditProfile;
