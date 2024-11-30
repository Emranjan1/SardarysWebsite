// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { getCategories, getProducts } from '../services/api';
import Basket from './Basket';
import CategoryProducts from './CategoryProducts';
import './HomePage.css';

const HomePage = ({ addToBasket, basket }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        // Assuming productsData is an array of products with an `isVisible` flag
        const visibleProducts = productsData.filter(product => product.isVisible);
        setProducts(visibleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <div className="homepage-container">
      <div className="intro-section">
        <img src="/uploads/homepage.png" alt="Homepage" className="homepage-image" />
        <div className="intro-text">
          <h1>Sardary's - Earl's Court</h1>
          <p>Household Goods · Grocery · Drinks</p>
          <Link to="/infopage" className="info-button">Info map allergen and hygiene rating</Link>
        </div>
      </div>
      <div className="content-section">
        <div className="categories-container">
          <h2>Categories</h2>
          <div className="categories-list">
            {categories.map((category) => {
              const categoryProducts = products.filter((product) => product.categoryId === category.id);
              const firstProductImage = categoryProducts.find(product => product.isVisible)?.image;
              return (
                <Link to={`/category/${category.id}`} key={category.id} className="category-link">
                  {firstProductImage && <img src={`/${firstProductImage}`} alt={category.name} className="category-image" />}
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <Basket basket={basket} />
      </div>
      <Routes>
        <Route path="/category/:id" element={<CategoryProducts addToBasket={addToBasket} />} />
      </Routes>
    </div>
  );
};

export default HomePage;
