import React from 'react';

const TagFilter = ({ tags, selectedTags, onTagToggle, tagCounts }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Filter by Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag} ({tagCounts[tag]})
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;