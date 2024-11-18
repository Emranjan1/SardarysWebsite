import React, { useState, useEffect } from 'react';
import { getPromoCodes, createPromoCode, deletePromoCode } from '../services/api'; // Ensure you have the deletePromoCode API method implemented
import { useAuth } from '../context/AuthContext'; // Adjust the import path as necessary

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [usageLimit, setUsageLimit] = useState(1);
  const { authToken, userDetails } = useAuth(); // Use authToken for API requests

  useEffect(() => {
    const fetchPromoCodes = async () => {
      if (!authToken) return;  // Guard clause if no token
      try {
        const fetchedPromoCodes = await getPromoCodes(authToken);  // Pass authToken to your API method
        setPromoCodes(fetchedPromoCodes);
      } catch (error) {
        console.error('Failed to fetch promo codes', error);
      }
    };
  
    fetchPromoCodes();
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails.isAdmin) {
      console.error('Unauthorized access attempt to create promo code.');
      return;  // Early exit if user is not an admin
    }
    const promoData = {
      code,
      discountPercentage: parseFloat(discount),
      validFrom,
      validUntil,
      usageLimit: parseInt(usageLimit, 10)
    };
    try {
      const newPromo = await createPromoCode(promoData);
      setPromoCodes([...promoCodes, newPromo]);
      setCode('');
      setDiscount('');
      setValidFrom('');
      setValidUntil('');
      setUsageLimit(1);
    } catch (error) {
      console.error('Error creating promo code', error);
    }
  };

  const handleDelete = async (promoCodeId) => {
    if (!userDetails.isAdmin) {
      console.error('Unauthorized access attempt to delete promo code.');
      return;  // Early exit if user is not an admin
    }
    try {
      await deletePromoCode(promoCodeId);
      setPromoCodes(promoCodes.filter(code => code.id !== promoCodeId));
    } catch (error) {
      console.error('Failed to delete promo code', error);
    }
  };

  return (
    <div>
      <h2>Manage Promo Codes</h2>
      {userDetails.isAdmin && ( // Only show form if user is an admin
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} required />
        <input type="number" placeholder="Discount Percentage" value={discount} onChange={(e) => setDiscount(e.target.value)} required />
        <input type="date" placeholder="Valid From" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} required />
        <input type="date" placeholder="Valid Until" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required />
        <input type="number" placeholder="Usage Limit" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} required />
        <button type="submit">Create Promo Code</button>
      </form>
            )}

{promoCodes.map(code => (
        <div key={code.id}>
          Code: {code.code}, Discount: {code.discountPercentage}%, Valid From: {code.validFrom}, Valid Until: {code.validUntil}
          {userDetails.isAdmin && <button onClick={() => handleDelete(code.id)}>Delete</button>}
           </div>
      ))}
    </div>
  );
};

export default PromoCodes;
