import React, { useEffect } from 'react';

const ApplePayComponent = ({ onPaymentSuccess }) => {
  useEffect(() => {
    async function initializeApplePay() {
      if (!window.Square) {
        console.error('Square.js failed to load properly');
        return;
      }

      try {
        const payments = window.Square.payments('sandbox-sq0idb-4y3jJC_UJHzVh6XW9zreaw', 'L8SSHTT06EVS1');
        const paymentRequest = payments.paymentRequest({
          countryCode: 'GB',
          currencyCode: 'GBP',
          total: {
              amount: '1.00',
              label: 'Total',
          },
        });
        const applePay = await payments.applePay(paymentRequest);
        const token = await applePay.tokenize();
        if (token) {
          console.log('Tokenization successful:', token.token);
          onPaymentSuccess(token.token);
        }
      } catch (error) {
        console.error('Failed to initialize Apple Pay:', error);
      }
    }

    initializeApplePay();
  }, [onPaymentSuccess]);

  return (
    <div>
      <button id="apple-pay-button" type="button">Pay with Apple Pay</button>
    </div>
  );
};

export default ApplePayComponent;
