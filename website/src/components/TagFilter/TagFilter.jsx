// src/components/TagFilter/TagFilter.jsx
import React from "react";

const TagFilter = ({
  tags,
  selectedTags,
  onTagToggle,
  showAllTags,
  onToggleShowAllTags,
  tagCounts = {},
}) => {
  return (
    <div className="mb-8 mt-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-gray-100"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            } hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors duration-200`}
            onClick={() => onTagToggle(tag)}
          >
            {tag} <span className="font-bold">({tagCounts[tag] || 0})</span>
          </button>
        ))}
      </div>
      <button
        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-2"
        onClick={onToggleShowAllTags}
      >
        {showAllTags ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default TagFilter;