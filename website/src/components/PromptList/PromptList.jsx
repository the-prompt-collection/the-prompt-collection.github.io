import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const PromptList = ({
  prompts,
  loadMorePrompts,
  hasMore,
  onSelectPrompt,
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {prompts.map((prompt, index) => (
          <div
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col gap-3 h-full"
          >
            <div className="flex items-center justify-between">
              {prompt.category && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {prompt.category}
                </span>
              )}
              {prompt.isSystemPrompt && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                  System Prompt
                </span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1 dark:text-gray-100">
                {prompt.title || prompt.filename || 'Untitled Prompt'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
                {prompt.description || prompt.content.substring(0, 150) + '...'}
              </p>
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto pt-3">
                {prompt.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PromptList;