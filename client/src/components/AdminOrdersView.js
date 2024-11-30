import React, { useState, useEffect, useCallback } from 'react';
import AdminOrderDetailModal from './AdminOrderDetailModal';
import './AdminOrdersView.css';

const AdminOrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filters, setFilters] = useState({ date: '', status: '', customerName: '' });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Europe/London' };
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', options);
    };
    

    const applyFiltersAndSort = useCallback((data) => {
        let filteredData = data.filter(order => {
            return (filters.date ? formatDate(order.orderDate).includes(filters.date) : true) &&
                   (filters.status ? order.status.includes(filters.status) : true) &&
                   (filters.customerName ? order.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) : true);
        });

        if (sortConfig.key) {
            filteredData = filteredData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        setOrders(filteredData);
    }, [filters, sortConfig]);

    const fetchOrders = useCallback(async () => {
        console.log('Fetching orders...');
        try {
            const response = await fetch(`/api/orders/admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            applyFiltersAndSort(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message);
        }
    }, [applyFiltersAndSort]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // fetchOrders is now included in the dependency array

    const handleOrderClick = (order) => {
        console.log("Order clicked:", order);
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        fetchOrders(); // Refetch orders when modal closes
        setSelectedOrder(null);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <h1>Admin Orders View</h1>
            {error && <p>{error}</p>}
            <input type="text" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} placeholder="Filter by Date"/>
            <input type="text" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} placeholder="Filter by Status"/>
            <input type="text" value={filters.customerName} onChange={(e) => setFilters({ ...filters, customerName: e.target.value })} placeholder="Filter by Customer Name"/>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('orderNumber')}>Order Number</th>
                            <th onClick={() => requestSort('orderDate')}>Order Date</th>
                            <th onClick={() => requestSort('totalAmount')}>Total Amount</th>
                            <th onClick={() => requestSort('status')}>Status</th>
                            <th>Customer ID</th>
                            <th onClick={() => requestSort('customerName')}>Customer Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId} onClick={() => handleOrderClick(order)}>
                                <td>{order.orderNumber}</td>
                                <td>{formatDate(order.orderDate)}</td>
                                <td>£{order.totalAmount}</td>
                                <td>{order.status}</td>
                                <td>{order.customerId}</td>
                                <td>{order.customerName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedOrder && <AdminOrderDetailModal order={selectedOrder} onClose={handleCloseModal} />}
        </div>
    );
};

export default AdminOrdersView;
