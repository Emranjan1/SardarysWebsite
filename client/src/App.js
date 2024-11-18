import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthenticatedApp from './AuthenticatedApp'; // Import the AuthenticatedApp component

const App = () => {
    const [basket, setBasket] = useState([]);

    const handleOrderConfirm = useCallback(() => {
        console.log("Order has been confirmed!");
        setBasket([]); // Clears the basket after order confirmation
    }, []);

    const addToBasket = useCallback((product) => {
        console.log("Attempting to add to basket:", product);
        setBasket((currentBasket) => {
            const index = currentBasket.findIndex((item) => item.id === product.id);
            if (index !== -1) {
                const updatedBasket = currentBasket.map((item, idx) =>
                    idx === index ? { ...item, quantity: item.quantity + 1 } : item
                );
                console.log("Basket updated (existing product):", updatedBasket);
                return updatedBasket;
            }
            const newBasket = [...currentBasket, { ...product, quantity: 1 }];
            console.log("Basket updated (new product):", newBasket);
            return newBasket;
        });
    }, []);
    return (
        <AuthProvider>
            <Router>
                <AuthenticatedApp 
                    basket={basket} 
                    addToBasket={addToBasket} 
                    onOrderConfirm={handleOrderConfirm} />
            </Router>
        </AuthProvider>
    );
};

export default App;
