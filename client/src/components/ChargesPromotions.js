import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure this hook is imported correctly

function ChargesPromotions() {
  const [settings, setSettings] = useState({
    maxDistance: 5,
    costPerMile: 1,
    promotionDetails: {
      spend: 50,
      discount: 10
    }
  });
  
  const { authToken } = useAuth(); // Correctly using the hook to get authToken

  const fetchSettings = useCallback(() => {
    if (!authToken) {
      console.log("No authorization token available.");
      return;
    }

    fetch(`/api/admin/delivery-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Use authToken from context
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Fetched data:", data);
      if (data && data.length) {
        const newState = {};
        data.forEach(setting => {
          switch (setting.key) {
            case 'deliveryRate':
              newState.costPerMile = setting.value.ratePerMile;
              break;
            case 'generalSettings':
              newState.maxDistance = setting.value.maxDistance;
              newState.promotionDetails = setting.value.promotionDetails;
              break;
            default:
              console.log('Unrecognized setting key:', setting.key);
          }
        });
        setSettings(prev => ({ ...prev, ...newState }));
      }
    })
    .catch((error) => {
      console.error('Failed to fetch settings:', error);
    });
  }, [authToken]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    if (name === 'spend' || name === 'discount') {
      setSettings(prevSettings => ({
        ...prevSettings,
        promotionDetails: { ...prevSettings.promotionDetails, [name]: parseFloat(value) }
      }));
    } else {
      setSettings(prevSettings => ({
        ...prevSettings,
        [name]: parseFloat(value)
      }));
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!authToken) {
      alert("You are not authorized to perform this action.");
      return;
    }
    const settingsData = {
      key: 'generalSettings',
      value: {
        ratePerMile: settings.costPerMile,
        maxDistance: settings.maxDistance,
        promotionDetails: settings.promotionDetails
      }
    };

    fetch(`/api/admin/update-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
      },
        body: JSON.stringify(settingsData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Settings updated successfully');
        fetchSettings(); // Refetch settings to update UI
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to update settings');
    });
  }

  return (
    <div>
      <h1>Charges and Promotions Management</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Max Delivery Distance (miles):
          <input type="number" name="maxDistance" value={settings.maxDistance} onChange={handleChange} />
        </label>
        <label>
          Cost Per Mile (£):
          <input type="number" name="costPerMile" value={settings.costPerMile} onChange={handleChange} />
        </label>
        <label>
          Promotion Spend Amount (£):
          <input type="number" name="spend" value={settings.promotionDetails.spend} onChange={handleChange} />
        </label>
        <label>
          Promotion Discount (%):
          <input type="number" name="discount" value={settings.promotionDetails.discount} onChange={handleChange} />
        </label>
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
}

export default ChargesPromotions;
