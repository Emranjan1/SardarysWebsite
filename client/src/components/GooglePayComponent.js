import React, { useEffect } from 'react';

const GooglePayComponent = ({ onPaymentSuccess }) => {
  useEffect(() => {
    async function initializeGooglePay() {
      if (!window.Square) {
        console.error('Square.js failed to load properly');
        return;
      }

      try {
        const payments = window.Square.payments('sandbox-sq0idb-4y3jJC_UJHzVh6XW9zreaw', 'L8SSHTT06EVS1')
        const paymentRequest = payments.paymentRequest({
          countryCode: 'GB',
          currencyCode: 'GBP',
          total: {
              amount: '1.00',
              label: 'Total',
          },
        });
        const googlePay = await payments.googlePay(paymentRequest);
        const token = await googlePay.tokenize();
        if (token) {
          console.log('Tokenization successful:', token.token);
          onPaymentSuccess(token.token);
        }
      } catch (error) {
        console.error('Failed to initialize Google Pay:', error);
      }
    }

    initializeGooglePay();
  }, [onPaymentSuccess]);

  return (
    <div>
      <button id="google-pay-button" type="button">Pay with Google Pay</button>
    </div>
  );
};

export default GooglePayComponent;
