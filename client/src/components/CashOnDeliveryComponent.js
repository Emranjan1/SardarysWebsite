import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation

const CashOnDeliveryComponent = ({ onOrderConfirm }) => {
    const { authToken } = useAuth();  // Destructure to get authToken directly
    const location = useLocation();  // Use location to access navigation state
    const { basket, totalAmount } = location.state || { basket: [], totalAmount: 0 }; // Default to empty if no state
    const navigate = useNavigate();
    useEffect(() => {
    }, [basket, totalAmount]); // Log on mount and update

    const handleConfirmOrder = async () => {
        const orderItems = basket.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));
    
        console.log("Order Items being sent:", orderItems);  // Add this line to check the order items
    
        const orderDetails = {
            orderItems: orderItems,
            totalAmount: totalAmount,
            paymentMethod: 'Cash on Delivery',
            isCashOnDelivery: true  // Explicitly set the flag to true for Cash on Delivery
        };
    
        console.log("Order Details being sent:", orderDetails);  // Log the full details being sent
    
        try {
            const response = await axios.post(`/api/orders`, orderDetails, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
    
            if (response.status === 201) {
                alert(`Order confirmed! Your order number is ${response.data.orderNumber}`);
                onOrderConfirm();
                navigate('/order-summary', { state: { orderDetails: response.data } });
            }
        } catch (error) {
            console.error('Failed to confirm order:', error);
            alert('There was a problem confirming your order. Please try again.');
        }
    };    
    

    return (
        <div>
            <h1>Cash on Delivery</h1>
            <p>Please confirm that you will pay with cash upon delivery.</p>
            <button onClick={handleConfirmOrder}>Confirm Order</button>
        </div>
    );
};

export default CashOnDeliveryComponent;
