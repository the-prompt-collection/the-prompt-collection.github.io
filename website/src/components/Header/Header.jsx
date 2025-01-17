// src/components/Header/Header.jsx
import React from 'react';
import { FaBook } from 'react-icons/fa'; // Import the library icon

const Header = ({ totalPrompts }) => {
  return (
    <div className="mb-8 pt-8"> {/* Increased margin-bottom */}
      <a href="/" className="no-underline"> {/* Use an <a> tag for navigation */}
        <h1 className="text-3xl font-bold underline mb-4 flex items-center cursor-pointer text-gray-900 dark:text-gray-100">
          <FaBook className="mr-2 text-gray-900 dark:text-gray-100" /> {/* Add the icon before the page name */}
          The Prompt Collection
        </h1>
      </a>
      <div className="mb-4">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Total Prompts: <span className="font-bold">{totalPrompts}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;