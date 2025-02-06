// src/components/ReferencesSection/ReferencesSection.jsx
import React from 'react';

const ReferencesSection = ({ referencesData }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Learn More About Prompt Engineering
      </h2>
      <div className="space-y-4">
        {referencesData.map((ref, index) => (
          <a
            key={index}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200"
          >
            <div className="font-medium dark:text-gray-100">
              {ref.title} | {ref.source}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {ref.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ReferencesSection;