import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PaymentForm, GooglePay, ApplePay } from 'react-square-web-payments-sdk';
import { handlePaymentSubmit } from '../utils/handlePaymentSubmit';

const PaymentOptions = ({onOrderConfirm}) => {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

   // Updated to handle different payment methods
   const handlePaymentMethodSelection = useCallback((method) => {
    console.log(`Navigating to payment method: ${method}`);
    switch (method) {
      case 'card':
        navigate(`/cardpayment`, { state: { totalAmount: location.state?.totalAmount, basket: location.state?.basket } });
      break;
      case 'cash':
        navigate(`/cash-on-delivery`, { state: { totalAmount: location.state?.totalAmount, basket: location.state?.basket } });
        break;
      default:
        console.log('No valid payment method selected');
    }
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
      {/* <button onClick={() => handlePaymentMethodSelection('applePay')}>Apple Pay</button>
      <button onClick={() => handlePaymentMethodSelection('googlePay')}>Google Pay</button> */}
      <PaymentForm
        applicationId={`${process.env.REACT_APP_SQUARE_APP_ID}`}
        cardTokenizeResponseReceived={async (token, verifyBuyer) =>
          handlePaymentSubmit(
            token,
            verifyBuyer,
            { totalAmount, basket },
            navigate,
            onOrderConfirm
          )
        }
        locationId={`${process.env.REACT_APP_SQUARE_LOCATION_ID}`}
        
        createPaymentRequest={() => ({
          countryCode: "GB",
          currencyCode: "GBP",
          total: {
            amount: JSON.stringify(totalAmount),
            label: "Total",
          },
        })}
      >
        <GooglePay />
        {/* ApplePay only renders on Apple devices (e.g: mac) */}
        <ApplePay />
      </PaymentForm>
      <button onClick={() => handlePaymentMethodSelection('cash')}>Cash on Delivery</button>
    </div>
  );
};

export default React.memo(PaymentOptions);
