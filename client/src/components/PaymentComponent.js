import React, { useEffect, useState } from 'react';

const PaymentComponent = () => {
  const [card, setCard] = useState(null);

  useEffect(() => {
    console.log('PaymentComponent Mounted');
    async function initializeCard() {
      if (!window.Square) {
        console.error('Square.js failed to load properly');
        return;
      }
      try {
        const payments = window.Square.payments(process.env.REACT_APP_SQUARE_APP_ID, process.env.REACT_APP_SQUARE_LOCATION_ID);
        const card = await payments.card();
        await card.attach('#card-container');
        setCard(card);
      } catch (error) {
        console.error('Failed to initialize the card:', error);
      }
    }
    
    initializeCard();
    return () => {
      console.log('PaymentComponent Unmounted');
    };
  }, []);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!card) {
      console.error('Card not initialized');
      return;
    }
    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        console.log('Token:', result.token);
      } else {
        console.error('Tokenization failed:', result.errors);
      }
    } catch (error) {
      console.error('Failed to tokenize card:', error);
    }
  };

  return (
    <div>
      <form id="payment-form" onSubmit={handlePaymentSubmit}>
        <div id="card-container"></div>
        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default PaymentComponent;
