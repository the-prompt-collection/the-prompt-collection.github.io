// src/components/ReferencesSection/ReferencesSection.jsx
import React from 'react';

const ReferencesSection = ({ referencesData }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Learn More About Prompt Engineering
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {referencesData.map((ref, index) => (
          <div
            key={index}
            className="card p-4 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg"
          >
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <h3 className="font-bold dark:text-gray-100">{ref.title}</h3>
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {ref.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferencesSection;