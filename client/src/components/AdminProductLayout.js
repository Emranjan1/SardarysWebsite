import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCategories, getProductsByCategory, updateProductDisplayOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminProductLayout.css'; // Ensure CSS is correctly linked

const DraggableProduct = ({ id, name, price, image, index, moveProduct }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'product',
    item: { id, index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, index]);

  const [, drop] = useDrop(() => ({
    accept: 'product',
    hover(item, monitor) {
      if (item.id !== id) {
        const dragIndex = item.index;
        const hoverIndex = index;
        moveProduct(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    }
  }), [id, index]);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="product-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={`/${image}`} alt={name} className="product-image" />
      <p className="product-name">{name} - £{price}</p>
    </div>
  );
};

function AdminProductLayout() {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {

    if (!userDetails || !userDetails.isAdmin) {
      navigate('/login');
      return;
    }

    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        const initialCategory = data[0];
        setSelectedCategory(initialCategory);
        fetchProducts(initialCategory.id);
      }
    }
      loadCategories();
  }, [userDetails, navigate]);

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    setSelectedCategory(category);
    fetchProducts(category.id);
  };

  const fetchProducts = async (categoryId) => {
    const fetchedProducts = await getProductsByCategory(categoryId);
    setProducts(fetchedProducts.sort((a, b) => a.displayOrder - b.displayOrder));
  };

  const moveProduct = (dragIndex, hoverIndex) => {
    const dragProduct = products[dragIndex];
    const newProducts = [...products];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(hoverIndex, 0, dragProduct);
    setProducts(newProducts);
    updateProductDisplayOrder(dragProduct.id, { displayOrder: hoverIndex });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="admin-product-layout">
        <h2>Select a Category</h2>
        <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory?.id}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {selectedCategory && <h3>Selected Category: {selectedCategory.name}</h3>}
        <div className="products-list">
          {products.map((product, index) => (
            <DraggableProduct
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              index={index}
              moveProduct={moveProduct}
            />
          ))}
        </div>
        <button onClick={() => alert('Layout confirmed')} className="submit-layout-button">Confirm Layout</button>
      </div>
    </DndProvider>
  );
}

export default AdminProductLayout;
