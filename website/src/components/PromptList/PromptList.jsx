// src/components/PromptList/PromptList.jsx
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PromptItem from './PromptItem';

const PromptList = ({ prompts, loadMorePrompts, hasMore, onSelectPrompt, tagCounts }) => {
  return (
    <div className="mb-8"> {/* Increased margin-bottom */}
      <InfiniteScroll
        dataLength={prompts.length}
        next={loadMorePrompts}
        hasMore={hasMore}
        loader={<h4 className="text-center my-4 text-gray-700">Loading...</h4>}
        endMessage={<p className="text-center my-4 text-gray-700">No more prompts</p>}
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
};

export default PromptList;