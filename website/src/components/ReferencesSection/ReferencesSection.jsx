// src/components/ReferencesSection/ReferencesSection.jsx
import React from 'react';

const ReferencesSection = ({ referencesData }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn More About Prompt Engineering</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {referencesData.map((ref, index) => (
          <div
            key={index}
            className="card p-4 hover:shadow-md transition-shadow duration-200"
          >
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <h3 className="font-bold">{ref.title}</h3>
            </a>
            <p className="text-sm text-gray-600 mt-2">{ref.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferencesSection;