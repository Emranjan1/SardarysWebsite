import React from 'react';
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
    console.log("Order data received in modal:", order);

    if (!order || !Array.isArray(order.products) || order.products.length === 0) {
      console.log('No order items found:', order);
      return (
        <div className="order-modal-backdrop" onClick={onClose}>
            <div className="order-modal">
                <button className="order-modal-close-button" onClick={onClose}>Close</button>
                <h2>No Order Details Available</h2>
            </div>
        </div>
      );
    }

    // Ensure totalAmount is a number before using toFixed
    const totalAmount = parseFloat(order.totalAmount).toFixed(2);

    return (
        <div className="order-modal-backdrop" onClick={onClose}>
            <div className="order-modal" onClick={e => e.stopPropagation()}>
                <button className="order-modal-close-button" onClick={onClose}>Close</button>
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> £{totalAmount}</p>
                <div className="order-modal-product-list">
                    <ul>
                        {order.products.map((products, index) => (
                            <li key={index}>
                                <p><strong>Product Name:</strong> {products.productName}</p>
                                <p><strong>Price:</strong> £{parseFloat(products.productPrice).toFixed(2)}</p>
                                <p><strong>Quantity:</strong> {products.quantity}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
