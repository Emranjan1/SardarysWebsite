import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../services/api';
import './CategoryProducts.css';

const CategoryProducts = ({ addToBasket }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryProducts = await getProductsByCategory(id);
        const visibleProducts = categoryProducts.filter(product => product.isVisible); // Filter to only show visible products
        setProducts(visibleProducts);  // Preserving the order as delivered from the backend
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [id]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleClickOutside = useCallback((event) => {
    if (event.target.className === 'modal active') {
      closeModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="category-products-container">
      <button onClick={() => navigate(-1)} className="back-button">&larr; Back</button>
      <h1>Products</h1>
      <ul className="product-list">
      {products.map((product) => (
  <li key={product.id} className="product-item" onClick={() => handleProductClick(product)}>
    <img src={`http://localhost:5000/${product.image}`} alt={product.name} className="product-image" />
    <div className="product-info">
      <strong className="product-name">{product.name}</strong>
      <span className="product-price">£{product.price}</span>
      <button onClick={(e) => {
          e.stopPropagation();
          addToBasket({
            ...product,
            productId: product.id // Ensuring each product added to basket has a productId
          });
      }}>Add to Basket</button>
    </div>
  </li>
))}
      </ul>
      {selectedProduct && (
  <div className="modal active">
    <div className="modal-content">
      <span className="close-modal" onClick={closeModal}>&times;</span>
      <img src={`http://localhost:5000/${selectedProduct.image}`} alt={selectedProduct.name} className="modal-image" />
      <h2 className="modal-name">{selectedProduct.name}</h2>
      <p className="modal-description">{selectedProduct.description}</p>
      {selectedProduct.ageVerificationRequired && (
        <span className="age-verification">Age verification required</span>
      )}
      <span className="modal-price">£{selectedProduct.price}</span>
      <button onClick={() => addToBasket({
          ...selectedProduct,
          productId: selectedProduct.id // Adding productId when adding from modal
      })}>Add to Basket</button>
    </div>
  </div>
)}
    </div>
  );
};

export default CategoryProducts;
