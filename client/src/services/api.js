// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach the token to every request if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert('Session has expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// api.js
export const registerUser = async (userData) => {
  try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      return response.data;
  } catch (error) {
      console.error("Error in API call:", error); // Log error details
      if (error.response) {
          throw error.response; // Throw the error response so it can be caught by the catch block in handleSubmit
      } else {
          throw new Error('Network or setup error');
      }
  }
};


export const loginUser = async (userData) => {
  const response = await apiClient.post('/auth/login', userData);
  return response.data;
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (categoryData, token) => {
  try {
    const response = await apiClient.post('/categories', categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id, token) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getProducts = async (allVisible = false) => {
  const url = allVisible ? '/products?allVisible=true' : '/products';
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createProduct = async (productData, token) => {
  const response = await apiClient.post('/products', productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const searchProducts = async (query) => {
  try {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await apiClient.get(`/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};


// List all users
export const listUsers = async (token) => {
  const response = await apiClient.get('/auth/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a specific user
export const deleteUser = async (id, token) => {
  const response = await apiClient.delete(`/auth/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProduct = async (id, token) => {
  try {
    const response = await apiClient.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;  // This will allow you to catch and handle the error in the component.
  }
};

export const toggleProductVisibility = async (productId, token) => {
  const response = await apiClient.put(`/products/toggle-visibility/${productId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const getPromoCodes = async () => {
  try {
    const response = await apiClient.get('/promo-codes');
    return response.data;
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    throw error;
  }
};

export const createPromoCode = async (promoData) => {
  const response = await apiClient.post('/promo-codes', promoData);
  return response.data;
};
export const deletePromoCode = async (id, token) => {
  try {
    const response = await apiClient.delete(`/promo-codes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, // Ensure you're sending the auth token if required
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting promo code:', error);
    throw error;  // This will allow you to catch and handle the error in the component.
  }
};
// src/services/api.js

export const updateProductDisplayOrder = async (productId, displayOrderData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await apiClient.put(`/products/${productId}/display-order`, displayOrderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product display order:', error);
    throw error;
  }
};
// In your src/services/api.js
export const getOrders = async () => {
  try {
    const response = await apiClient.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;  // This will allow catching the error in the component where this function is used.
  }
};

// api.js or wherever you manage API calls

export const getAdminOrders = async () => {
  const response = await fetch('/api/orders/admin', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT for auth
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};
export const fetchCustomerDetails = async () => {
  try {
    const response = await apiClient.get('/customer/details');
    if (response.status === 200) {
      return response.data; // Return the response data directly
    } else {
      throw new Error('Failed to fetch customer details');
    }
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error; // Rethrow the error to be handled or logged by the calling component
  }
};
export const saveCustomerDetails = async (CustomerDetails) => {
  try {
    const response = await apiClient.put('/customer/update', CustomerDetails);
    return response.data; // Assuming the server sends back the updated details or a success message
  } catch (error) {
    console.error('Error saving customer details:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};
export const fetchCustomerDetailsById = async (customerId) => {
  try {
      const response = await apiClient.get(`/customers/${customerId}/details`);
      return response.data; // Assuming the server sends the appropriate response
  } catch (error) {
      console.error('Error fetching customer details:', error);
      throw error; // Rethrow to handle it in the component
  }
};

export const handleSquarePayment = async (paymentData)=> {
  console.log('payment: ',paymentData);
  const token = localStorage.getItem('token');
  try {
    const response = await apiClient.post('/payment', paymentData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.log("payment failed: ", error.message);
    throw error;
  }
}





