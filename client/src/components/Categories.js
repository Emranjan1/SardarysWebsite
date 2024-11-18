import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const { authToken, userDetails } = useAuth(); // Use auth context

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const addCategory = async () => {
    if (!authToken || !userDetails.isAdmin) {
      alert('You are not authorized to perform this action.');
      return;
    }

    if (newCategoryName.trim() === '') {
      return;
    }

    try {
      const newCategory = await createCategory({ name: newCategoryName }, authToken);
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      alert('Category created successfully');
    } catch (error) {
      if (error.response && error.response.data.message === 'Category already exists.') {
        alert('Category already exists');
      } else {
        console.error('Failed to create category', error);
        setError('Failed to create category');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!authToken || !userDetails.isAdmin) {
      alert('You are not authorized to perform this action.');
      return;
    }
    try {
      await deleteCategory(id, authToken);
      setCategories(categories.filter(category => category.id !== id));
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category', error);
      setError('Error deleting category');
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleDelete(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="New Category Name"
      />
      <button onClick={addCategory}>Add Category</button>
    </div>
  );
};

export default Categories;
