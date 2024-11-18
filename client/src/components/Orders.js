// Orders.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/api';
import OrderDetailModal from './OrderDetailModal';
import './Orders.css';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' });
  console.log(`Formatting date: ${dateStr} to ${formattedDate}`);
  return formattedDate;
};


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { authToken } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders();
        console.log('Fetched Orders Data:', ordersData); // Log the fetched orders data here
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [authToken, navigate]);

  const formatTotalAmount = (amount) => {
    // Ensure totalAmount is treated as a float and is defined
    return amount ? parseFloat(amount).toFixed(2) : '0.00';
  };

  const handleOrderClick = (order) => {
    console.log('Order clicked, preparing to open modal:', order);
    setSelectedOrder(order);
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.modal');
    if (modalBackdrop && modal) {
      modalBackdrop.style.display = 'flex';
      modalBackdrop.style.opacity = '1';
      modalBackdrop.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
    }
  };

  return (
    <div className="orders-page">
      <h2>View Orders</h2>
      <div className="orders-list">
        {orders.length > 0 ? orders.map(order => (
          <div key={order.orderNumber} className="order-item" onClick={() => handleOrderClick(order)}>
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p><strong>Date:</strong> {formatDate(order.orderDate)}</p>
            <p><strong>Total Amount:</strong> £{formatTotalAmount(order.totalAmount)}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Order Status:</strong> {order.orderStatus}</p>
          </div>
        )) : <p>No orders found.</p>}
      </div>
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      <Link to="/profile" className="back-button">Back to Profile</Link>
    </div>
  );
};

export default Orders;
