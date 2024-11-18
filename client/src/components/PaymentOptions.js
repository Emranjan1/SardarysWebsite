import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentOptions = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Define the useCallback hook at the top level, before any conditional logic or early returns.
  const handlePaymentMethodSelection = useCallback((method) => {
    console.log('Navigating to /cardpayment');
    navigate(`/cardpayment`, { state: { totalAmount: location.state?.totalAmount, basket: location.state?.basket } });
  }, [navigate, location.state]);

  // useEffect for authentication and redirection logic
  useEffect(() => {
    console.log('PaymentOptions Mounted'); // Log when the component mounts
    if (!authToken) {
      console.log('Redirecting to login due to no authToken');
      navigate('/login', { state: { from: '/payment' } });
    }

    return () => {
      console.log('PaymentOptions Unmounted'); // Log when the component unmounts
    };
  }, [authToken, navigate]);

  // Early return moved below the declaration of all hooks
  if (!authToken) {
    return null;
  }

  const { totalAmount, basket } = location.state || { totalAmount: 0, basket: [] };
  console.log("Received basket in paymentoptions:", basket, "Received totalAmount in paymentoptions:", totalAmount);

  return (
    <div>
      <h1>Choose Payment Method</h1>
      <button onClick={() => handlePaymentMethodSelection('card')}>Pay with Card</button>
      <button onClick={() => handlePaymentMethodSelection('applePay')}>Apple Pay</button>
      <button onClick={() => handlePaymentMethodSelection('googlePay')}>Google Pay</button>
      <button onClick={() => handlePaymentMethodSelection('cash')}>Cash on Delivery</button>
    </div>
  );
};

export default React.memo(PaymentOptions);
