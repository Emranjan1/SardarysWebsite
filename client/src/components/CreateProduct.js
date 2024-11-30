import React, { useState, useEffect } from 'react';
import { createProduct, getCategories, getProducts, deleteProduct, toggleProductVisibility } from '../services/api';
import { useAuth } from '../context/AuthContext';  // Make sure the path is correct based on your project structure

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [ageVerificationRequired, setAgeVerificationRequired] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const { authToken } = useAuth();  // Destructure to get authToken

  const fetchData = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      const productsData = await getProducts(true);  // Request all products, visible or not
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async () => {
    if (!authToken) {
      setMessage('You are not logged in.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('categoryId', categoryId);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('ageVerificationRequired', ageVerificationRequired);

      const token = localStorage.getItem('token');
      await createProduct(formData, token);
      setMessage('Product created successfully');
      fetchData(); // Refresh the list after adding
    } catch (error) {
      console.error('Error creating product:', error);
      setMessage('Product creation failed');
    }
  };

  const handleDelete = async (productId) => {
    if (!authToken) {
      setMessage('You are not logged in.');
      return;
    }
    try {
      await deleteProduct(productId, authToken);
      setMessage('Product deleted successfully');
      fetchData(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage(`Error deleting product: ${error.response ? error.response.data.message : error.message}`);
    }
  };
  

  const handleToggleVisibility = async (productId) => {
    if (!authToken) {
      setMessage('You are not logged in.');
      return;
    }
    try {
      await toggleProductVisibility(productId, localStorage.getItem('token'));
      setMessage('Product visibility toggled');
      // Do not filter out products, just refresh to show the updated state
      fetchData();
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      setMessage('Failed to toggle visibility');
    }
  };
  

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Create Product</h2>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Price (£)" onChange={(e) => setPrice(e.target.value)} />
      <select onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)}></textarea>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <label>
        Age Verification Required:
        <input
          type="checkbox"
          checked={ageVerificationRequired}
          onChange={(e) => setAgeVerificationRequired(e.target.checked)}
        />
      </label>
      <button onClick={handleCreateProduct}>Create Product</button>
      <p>{message}</p>

      <h2>Manage Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="product-list">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-item">
            <img src={`/${product.image}`} alt={product.name} className="product-image" />
            <div className="product-info">
              <strong>{product.name}</strong>
              <p>£{product.price}</p>
              <button onClick={() => handleToggleVisibility(product.id)}>
                {product.isVisible ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateProduct;
