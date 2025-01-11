// src/components/PromptList/PromptList.jsx
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PromptItem from './PromptItem';

// Mock icons for categories (replace with actual icons or dynamic logic)
const categoryIcons = {
  'ai-tools': '🤖',
  'uncategorized': '📁',
  // Add more mappings as needed
};

const PromptList = ({
  prompts,
  loadMorePrompts,
  hasMore,
  onSelectPrompt,
  tagCounts,
  selectedCategory,
  onCategoryClick,
  onBackToCategories,
  groupedPrompts,
  showCategoryList,
}) => {
  // Render category cards
  const renderCategoryView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(groupedPrompts).map(([category, prompts]) => (
        <div
          key={category}
          className="card p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 text-center bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg"
          onClick={() => onCategoryClick(category)}
        >
          <div className="text-4xl mb-4">
            {categoryIcons[category.toLowerCase()] || '📁'}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {category}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {prompts.length} prompts
          </p>
        </div>
      ))}
    </div>
  );

  // Render prompts for the selected category or filtered prompts
  const renderPromptView = () => (
    <div>
      {selectedCategory && (
        <button
          onClick={onBackToCategories}
          className="mb-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          ← Back to Categories
        </button>
      )}
      <InfiniteScroll
        dataLength={prompts.length}
        next={loadMorePrompts}
        hasMore={hasMore}
        loader={
          <h4 className="text-center my-4 text-gray-700 dark:text-gray-300">
            Loading...
          </h4>
        }
        endMessage={
          <p className="text-center my-4 text-gray-700 dark:text-gray-300">
            No more prompts
          </p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt, index) => (
            <PromptItem
              key={index}
              index={index}
              prompts={prompts}
              onSelectPrompt={onSelectPrompt}
              tagCounts={tagCounts}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );

  return (
    <div className="mb-8">
      {showCategoryList ? renderCategoryView() : renderPromptView()}
    </div>
  );
};

export default PromptList;