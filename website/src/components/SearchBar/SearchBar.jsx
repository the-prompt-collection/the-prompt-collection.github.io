// src/components/SearchBar/SearchBar.jsx
import React from 'react';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch }) => {
  const handleSearch = debounce((query) => {
    onSearch(query);
  }, 300);

  return (
    <input
      type="text"
      placeholder="Search by category, subcategory, or description..."
      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
};

export default SearchBar;