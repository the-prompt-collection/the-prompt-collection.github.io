// src/components/Header/Header.jsx
import React from 'react';
import { FaBook } from 'react-icons/fa'; // Import the library icon

const Header = () => {
  return (
    <div className="mb-6 sm:mb-8 pt-4 sm:pt-8 px-2 sm:px-0"> {/* Adjusted margin and padding */}
      <a href="/" className="no-underline"> {/* Use an <a> tag for navigation */}
        <h1 className="text-2xl sm:text-3xl font-bold underline mb-3 sm:mb-4 flex items-center cursor-pointer text-gray-900 dark:text-gray-100">
          <FaBook className="mr-2 text-gray-900 dark:text-gray-100" /> {/* Add the icon before the page name */}
          <span className="truncate">The Prompt Collection</span> {/* Truncate the page name */}
        </h1>
      </a>
    </div>
  );
};

export default Header;