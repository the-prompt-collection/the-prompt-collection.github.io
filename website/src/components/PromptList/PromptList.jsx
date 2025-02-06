import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PromptItem from './PromptItem'; // New import
import { FolderOpen } from 'lucide-react';

const PromptList = ({
  prompts,
  loadMorePrompts,
  hasMore,
  onSelectPrompt,
  onQuickAction, // add onQuickAction prop here
  selectedCategory,
  onCategoryClick,
  onBackToCategories,
  groupedPrompts,
  showCategoryList,
  totalPrompts,
  totalFilteredPrompts // Add this new prop
}) => {
  if (showCategoryList) {
    return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <FolderOpen className="w-7 h-7" />
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse through our collection of <span className="font-semibold text-blue-600 dark:text-blue-400">{totalPrompts}</span> carefully curated prompts
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {Object.entries(groupedPrompts).map(([category, categoryPrompts]) => (
            <div
              key={category}
              onClick={() => onCategoryClick(category)}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">
                {category}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {categoryPrompts.length} prompts
              </p>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="mt-4 sm:mt-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        {selectedCategory && (
          <button
            onClick={onBackToCategories}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Categories
          </button>
        )}
        <div className="text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-auto">
          {totalFilteredPrompts} prompts found {/* Show total filtered count instead of visible prompts */}
          {prompts.length < totalFilteredPrompts && ` (showing ${prompts.length})`} {/* Show current visible count if less than total */}
        </div>
      </div>

      <InfiniteScroll
        dataLength={prompts.length}
        next={loadMorePrompts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {prompts.map((prompt, index) => (
          <PromptItem
            key={index}
            prompt={prompt}
            onSelectPrompt={onSelectPrompt}
            onQuickAction={onQuickAction} // now correctly defined
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PromptList;