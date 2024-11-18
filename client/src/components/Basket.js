import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Basket.css';

const Basket = ({ basket = [] }) => {
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const [deliveryCharge, setDeliveryCharge] = useState(0); // Set to 0 for free delivery

    useEffect(() => {
        // Setting the delivery charge fixed to zero
        setDeliveryCharge(0);
    }, [basket]); // Only re-run when basket changes

    // Calculate the total amount only if the basket is not undefined
    const totalAmount = useMemo(() => {
        return basket.reduce((total, item) => total + item.price * item.quantity, 0) + deliveryCharge;
    }, [basket, deliveryCharge]);

    const navigationState = useMemo(() => ({
        totalAmount,
        basket
    }), [totalAmount, basket]);

    const handleNavigateToPaymentOptions = () => {
        if (authToken) {
            navigate('/payment', { state: navigationState });
        } else {
            navigate('/login', { state: { from: '/payment', ...navigationState } });
        }
    };

    return (
        <div className="basket-container">
            <h2>Your Basket</h2>
            {basket.length === 0 ? (
                <div>
                    <p>Your basket is empty.</p>
                    <Link to="/" className="back-to-shopping">Continue Shopping</Link>
                </div>
            ) : (
                <div>
                    <ul>
                        {basket.map((item) => (
                            <li key={item.id} className="basket-item">
                                <img src={`http://localhost:5000/${item.image}`} alt={item.name} width="50" />
                                <div>
                                    <span>{item.name}</span>
                                    <span>£{item.price.toFixed(2)}</span>
                                    <span>Quantity: {item.quantity}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="basket-total">
                        <h3>Delivery Charge: £{deliveryCharge.toFixed(2)}</h3>
                        <h3>Total: £{totalAmount.toFixed(2)}</h3>
                    </div>
                    <button onClick={handleNavigateToPaymentOptions} className="checkout-button">Go to Payment Options</button>
                </div>
            )}
        </div>
    );
};

export default Basket;
