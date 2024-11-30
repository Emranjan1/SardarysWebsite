import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '../services/api';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const { products, similarProducts } = await searchProducts(query);
          setResults(products);
          setSuggestions(similarProducts);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((product) => (
            <li key={product.id}>
              <img src={`/${product.image}`} alt={product.name} width="50" />
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}

      {suggestions.length > 0 && (
        <>
          <h3>Did you mean?</h3>
          <ul>
            {suggestions.map((product) => (
              <li key={product.id}>
                <img src={`/${product.image}`} alt={product.name} width="50" />
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SearchResults;