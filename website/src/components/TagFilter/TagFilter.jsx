import React from 'react';
import '../../styles/animations.css';
import ShareButton from '../ShareButton/ShareButton';

const TagFilter = ({ tags, selectedTags, onTagToggle, showAllTags, onToggleShowAllTags, tagCounts, showShareButton }) => {
  // Determine tag size based on count
  const getTagSize = (count) => {
    const maxCount = Math.max(...Object.values(tagCounts));
    const threshold1 = maxCount / 3;
    const threshold2 = (maxCount * 2) / 3;

    if (count >= threshold2) return 'large';
    if (count >= threshold1) return 'medium';
    return 'small';
  };

  // Size classes mapping
  const sizeClasses = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-5 py-2.5'
  };

  // Animation classes for floating effect
  const floatingAnimations = [
    'animate-float-slow',
    'animate-float-medium',
    'animate-float-fast'
  ];

  return (
    <div className={`space-y-${selectedTags.length > 0 ? '2' : '6'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Filter by Tags
          </h3>
          <button
            onClick={onToggleShowAllTags}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {showAllTags ? 'Show Popular Tags' : 'Show All Tags'}
          </button>
        </div>
        {showShareButton && (
          <ShareButton
            url={window.location.href}
            text="Share Filters"
          />
        )}
      </div>

      <div className={`relative ${selectedTags.length > 0 ? 'min-h-[100px]' : 'min-h-[200px]'} overflow-hidden`}>
        <div className="flex flex-wrap gap-3 justify-center items-center p-4">
          {tags.map((tag, index) => {
            const size = getTagSize(tagCounts[tag]);
            const animationClass = floatingAnimations[index % floatingAnimations.length];

            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`
                  rounded-full font-medium transition-all duration-200
                  ${sizeClasses[size]}
                  ${animationClass}
                  ${selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white dark:bg-blue-600 transform scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }
                  hover:scale-105 active:scale-95
                `}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {tag}
                <span className="ml-1 opacity-60">({tagCounts[tag]})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagFilter;