// src/components/Header/Header.jsx
import React from 'react';

const Header = ({ totalPrompts }) => {
  return (
    <div className="mb-8"> {/* Increased margin-bottom */}
      <h1 className="text-3xl font-bold underline mb-4">The Prompt Collection</h1>
      <div className="mb-4">
        <p className="text-lg">
          Total Prompts: <span className="font-bold">{totalPrompts}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;