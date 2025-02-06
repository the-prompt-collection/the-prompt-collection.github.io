// src/components/Header/Header.jsx
import React from 'react';
import { FaBook } from 'react-icons/fa'; // Import the library icon
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

const Header = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center">
        <a href="/" className="no-underline"> {/* Use an <a> tag for navigation */}
          <h1 className="text-2xl sm:text-3xl font-bold underline mb-3 sm:mb-4 flex items-center cursor-pointer text-gray-900 dark:text-gray-100">
            <FaBook className="mr-2 text-gray-900 dark:text-gray-100" /> {/* Add the icon before the page name */}
            <span className="truncate">The Prompt Collection</span> {/* Truncate the page name */}
          </h1>
        </a>
      </div>
      <DarkModeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} />
    </header>
  );
};

export default Header;