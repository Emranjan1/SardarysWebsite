import React, { useState } from 'react';
import './EditCustomerDetailModal.css'; // Make sure you create and link the corresponding CSS file

const EditCustomerDetailModal = ({ CustomerDetails, onSave, onClose }) => {
  const [editDetails, setEditDetails] = useState(CustomerDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editDetails);
    onClose(); // Close modal after saving
  };

  return (
    <div className="modal-background">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Customer Details</h2>
        <form onSubmit={e => e.preventDefault()}>
          <label>
            First Name:
            <input type="text" name="firstName" value={editDetails.firstName} onChange={handleChange} />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastName" value={editDetails.lastName} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={editDetails.email} onChange={handleChange} />
          </label>
          <label>
            Phone:
            <input type="text" name="phone" value={editDetails.phone} onChange={handleChange} />
          </label>
          <label>
            Address 1:
            <input type="text" name="addressLine1" value={editDetails.addressLine1} onChange={handleChange} />
          </label>
          <label>
            Address 2:
            <input type="text" name="addressLine2" value={editDetails.addressLine2} onChange={handleChange} />
          </label>
          <label>
            Postal Code:
            <input type="text" name="postalCode" value={editDetails.postalCode} onChange={handleChange} />
          </label>
          <label>
            City:
            <input type="text" name="city" value={editDetails.city} onChange={handleChange} />
          </label>
          <label>
            Country:
            <input type="text" name="country" value={editDetails.country} onChange={handleChange} />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerDetailModal;
