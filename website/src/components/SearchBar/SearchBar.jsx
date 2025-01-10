// src/components/SearchBar/SearchBar.jsx
import React, { useState } from 'react';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState(''); // Local state for the search query
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Debounced search handler
  const handleSearch = debounce((query) => {
    console.log(query);
    onSearch(query); // Pass the query to the parent component
    setIsLoading(false); // Reset loading state after search is complete
  }, 300);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Update local state
    setIsLoading(true); // Set loading state
    handleSearch(value); // Trigger debounced search
  };

  // Clear the search query
  const handleClear = () => {
    setQuery(''); // Clear local state
    onSearch(''); // Clear search in the parent component
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by category, subcategory, or description..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 pr-10"
        value={query}
        onChange={handleInputChange}
      />
      {/* Clear button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default SearchBar;