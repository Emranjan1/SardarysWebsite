import React, { useEffect, useState } from 'react';

const PaymentComponent = () => {
  const [card, setCard] = useState(null);

  useEffect(() => {
    console.log('PaymentComponent mounted');

    // Function to initialize the card
    async function initializeCard() {
      if (!window.Square) {
        console.error('Square.js failed to load properly');
        return;
      }

      if (card) {
        console.log('Card already initialized');
        return;
      }

      try {
        const payments = window.Square.payments(
          process.env.REACT_APP_SQUARE_APP_ID,
          process.env.REACT_APP_SQUARE_LOCATION_ID
        );

        const cardContainer = document.getElementById('card-container');
        if (!cardContainer) {
          console.error('Card container not found');
          return;
        }

        const newCard = await payments.card();
        await newCard.attach('#card-container');
        setCard(newCard);
      } catch (error) {
        console.error('Failed to initialize the card:', error);
      }
    }

    initializeCard();

    // Cleanup function to handle unmounting and reinitialization
    return () => {
      console.log('PaymentComponent unmounted');
      // Ensure cleanup is comprehensive to remove any references and listeners
      if (card) {
        // Assuming Square provides a method to detach or cleanup the card
        card.detach();  // This is a hypothetical method; replace with actual API call if available
      }
      // Add any additional cleanup logic if necessary
    };
  }, [card]); // Ensure useEffect runs correctly based on the state of 'card'

  // Handle the payment submission
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
    <form onSubmit={handlePaymentSubmit}>
      <div id="card-container"></div>
      <button type="submit">Pay</button>
    </form>
  );
};

export default PaymentComponent;
