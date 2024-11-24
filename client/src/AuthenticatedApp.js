import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Categories from './components/Categories';
import Basket from './components/Basket';
import Login from './components/Login';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import CustomerPage from './components/CustomerPage';
import Orders from './components/Orders';
import EditProfile from './components/EditProfile';
import Register from './components/Register';
import CategoryProducts from './components/CategoryProducts';
import InfoPage from './components/InfoPage';
import CreateProduct from './components/CreateProduct';
import ChargesPromotions from './components/ChargesPromotions';
import PromoCodes from './components/PromoCodes';
import AdminProductLayout from './components/AdminProductLayout';
import PaymentOptions from './components/PaymentOptions';
import CashOnDeliveryComponent from './components/CashOnDeliveryComponent';
import SearchResults from './components/SearchResults';
import OrderSummary from './components/OrderSummary';
import AdminOrdersView from './components/AdminOrdersView';
import PaymentComponent from './components/PaymentComponent';


const AuthenticatedApp = ({ basket, addToBasket, onOrderConfirm }) => {
    const { authToken, userDetails, logout } = useAuth();

    useEffect(() => {
        console.log('AuthenticatedApp component mounted');
        return () => console.log('AuthenticatedApp component unmounted');
    }, []);
    return (
        <>
            <Navbar isLoggedIn={!!authToken} isAdmin={userDetails?.isAdmin} onLogout={logout} basket={basket} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:id" element={<CategoryProducts addToBasket={addToBasket} basket={basket} />} />
                <Route path="/basket" element={<Basket basket={basket} />} />
                <Route path="/payment" element={authToken ? <PaymentOptions onOrderConfirm={onOrderConfirm} /> : <Navigate to="/login" replace />} />
                <Route path="/cash-on-delivery" element={authToken ? <CashOnDeliveryComponent onOrderConfirm={onOrderConfirm} /> : <Navigate to="/login" replace />} />
                <Route path="/cardpayment" element={authToken ? <PaymentComponent onOrderConfirm={onOrderConfirm} /> : <Navigate to="/login" replace />} />
                <Route path="/order-summary" element={authToken ? <OrderSummary /> : <Navigate to="/login" replace/> } />
                {userDetails.isAdmin && <Route path="/adminpanel" element={<AdminPanel />} />}
                {userDetails.isAdmin && <Route path="/add-product" element={<CreateProduct />} />}
                {userDetails.isAdmin && <Route path="/add-category" element={<Categories />} />}
                {userDetails.isAdmin && <Route path="/charges-promotions" element={<ChargesPromotions />} />}
                {userDetails.isAdmin && <Route path="/promo-codes" element={<PromoCodes />} />}
                {userDetails.isAdmin && <Route path="/admin/category/:id/layout" element={<AdminProductLayout />} />}
                {userDetails.isAdmin && <Route path="/admin/orders" element={<AdminOrdersView />} />}
                <Route path="/profile" element={authToken ? <CustomerPage /> : <Navigate to="/login" replace />} />
                <Route path="/orders" element={authToken ? <Orders /> : <Navigate to="/login" replace />} />
                <Route path="/profile/edit" element={authToken ? <EditProfile /> : <Navigate to="/login" replace/>} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/*" element={<HomePage />} />
            </Routes>
        </>
    );
};

export default AuthenticatedApp;
