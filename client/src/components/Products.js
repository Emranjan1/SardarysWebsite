import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Adjust the path as necessary
import './Products.css';

const Products = ({ searchResults = [] }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '', image: null });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const { authToken, userDetails } = useAuth(); // Destructure authToken and userDetails from useAuth
 
  useEffect(() => {

    if (searchResults.length > 0) {
      setProducts(searchResults);
    } else {
      const fetchProducts = async () => {
        console.log('Fetching products...');
        try {
          const data = await getProducts();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]); // Ensure products is always an array
        }
      };

      fetchProducts();
    }
  }, [searchResults]); // Ensure this effect runs only when searchResults change

  useEffect(() => {
    const fetchCategories = async () => {
      console.log('Fetching categories...');
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); // Ensure categories is always an array
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) {
      setError('Unauthorized, please login');
      return;
    }

    if (!userDetails.isAdmin) {
      setError('You do not have permission to add products');
      return;
    }

    try {

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('categoryId', newProduct.categoryId);
      formData.append('image', newProduct.image);

      await createProduct(formData, authToken);
      setNewProduct({ name: '', price: '', categoryId: '', image: null });
      setError('');
      alert('Product added successfully');
    } catch (err) {
      setError('Failed to add product');
    }
  };

  return (
    <div className="products-container">
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userDetails.isAdmin && (
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <select
            value={newProduct.categoryId}
            onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input type="file" onChange={handleFileChange} required />
          <button type="submit">Add Product</button>
        </form>
      )}
      <ul>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <li key={product.id} className="product-item">
              <img src={`http://localhost:5000/${product.image}`} alt={product.name} width="50" />
              {product.name} - £{product.price.toFixed(2)} 
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Products;
