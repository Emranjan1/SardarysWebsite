import React, { useState, useEffect } from 'react';
import './AdminOrderDetailModal.css';

const AdminOrderDetailModal = ({ order, onClose }) => {
    const [orderStatus, setOrderStatus] = useState(order ? order.orderStatus : '');
    const [CustomerDetails, setCustomerDetails] = useState(null);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await fetch(`/api/customer/customers/${order.customerId}/details`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch customer details');
                }

                const data = await response.json();
                setCustomerDetails(data);
            } catch (error) {
                console.error("Error fetching customer details:", error);
            }
        };

        if (order && order.customerId) {
            fetchCustomerDetails();
        }
    }, [order]);

    const saveChanges = async () => {
        if (orderStatus !== order.orderStatus) {
            try {
                const response = await fetch(`/api/orders/${order.orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ orderStatus })
                });

                if (!response.ok) {
                    throw new Error('Failed to update order status');
                }

                console.log("Order status updated successfully");
                onClose();
            } catch (err) {
                console.error("Error updating order status:", err.message);
            }
        } else {
            onClose();
        }
    };

    return (
        <div className="admin-order-modal-backdrop" onClick={onClose}>
            <div className="admin-order-modal-content" onClick={e => e.stopPropagation()}>
                <h2>Order Detail - {order.orderNumber}</h2>
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Total Amount: £{parseFloat(order.totalAmount).toFixed(2)}</p>
                <div>
                    <label>Order status:</label>
                    <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                        <option value="In Progress">In Progress</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Refunded">Refunded</option>
                    </select>
                </div>
                <div>
                    <h3>Customer Details</h3>
                    {CustomerDetails ? (
                        <>
                            <p><strong>Address:</strong> {CustomerDetails.addressLine1}, {CustomerDetails.addressLine2}</p>
                            <p><strong>City:</strong> {CustomerDetails.city}</p>
                            <p><strong>Postal Code:</strong> {CustomerDetails.postalCode}</p>
                            <p><strong>Country:</strong> {CustomerDetails.country}</p>
                        </>
                    ) : <p>Loading customer details...</p>}
                </div>
                <p>Customer ID: {order.customerId}</p>
                <p>Customer Name: {order.customerName}</p>
                {order.products.length ? (
                    <div>
                        <h3>Products</h3>
                        {order.products.map((product, index) => (
                            <div key={index} className="admin-order-item">
                                <p><strong>Product Name:</strong> {product.productName}</p>
                                <p><strong>Price:</strong> £{parseFloat(product.productPrice).toFixed(2)}</p>
                                <p><strong>Quantity:</strong> {product.productQuantity}</p>
                            </div>
                        ))}
                    </div>
                ) : <p>No product details available for this order.</p>}
                <button onClick={saveChanges}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AdminOrderDetailModal;
