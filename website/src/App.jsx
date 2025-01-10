import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash.debounce';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';
import prompts from './prompts/prompts.json';
import TagFilter from './components/TagFilter';
import Footer from './components/Footer';

const PAGE_SIZE = 50; // Number of prompts to load at a time

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [visiblePrompts, setVisiblePrompts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Extract all unique tags from prompts
  const allTags = [...new Set(prompts.flatMap((prompt) => prompt.tags || []))];

  // Calculate the total number of prompts
  const totalPrompts = prompts.length;

  // Calculate the number of prompts for each tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = prompts.filter((prompt) => (prompt.tags || []).includes(tag)).length;
    return acc;
  }, {});

  // Filter prompts based on search query and selected tags
  const filterPrompts = useCallback(() => {
    return prompts.filter((prompt) => {
      const category = prompt.category || '';
      const subcategories = prompt.subcategories || [];
      const content = prompt.content || '';

      const matchesSearch =
        category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subcategories.some((subcategory) =>
          subcategory.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => (prompt.tags || []).includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  // Load more prompts for infinite scroll
  const loadMorePrompts = () => {
    const filtered = filterPrompts();
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const newPrompts = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    setVisiblePrompts((prev) => [...prev, ...newPrompts]);
    setPage(nextPage);
    setHasMore(startIndex + PAGE_SIZE < filtered.length);
  };

  // Debounced search handler
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    setPage(1);
    setVisiblePrompts([]);
    setHasMore(true);
  }, 300);

  // Reset visible prompts when search or tags change
  useEffect(() => {
    const filtered = filterPrompts();
    setVisiblePrompts(filtered.slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filtered.length > PAGE_SIZE);
  }, [searchQuery, selectedTags, filterPrompts]);

  // Toggle a tag in the selected tags list
  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedPrompt.content).then(() => {
      setIsCopied(true); // Set copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Render a single prompt item
  const PromptItem = ({ index, style }) => {
    const prompt = visiblePrompts[index];
    if (!prompt) return null;

    return (
      <div
        style={style}
        className="p-4 border border-gray-200 rounded cursor-pointer hover:border-blue-500 transition-all duration-200"
        onClick={() => setSelectedPrompt(prompt)}
      >
        <h2 className="font-bold">{prompt.category || "Uncategorized"}</h2>
        <h3 className="text-sm text-gray-600">
          {prompt.subcategories?.join(', ') || "No Subcategories"}
        </h3>
        <p className="mt-2 text-sm">{prompt.content.substring(0, 100)}...</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(prompt.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
            >
              {tag} ({tagCounts[tag]})
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto p-4 flex-1 overflow-y-auto">
        <h1 className="text-3xl font-bold underline mb-4">The Prompt Collection</h1>

        {/* Summary Section */}
        <div className="mb-4">
          <p className="text-lg">
            Total Prompts: <span className="font-bold">{totalPrompts}</span>
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by category, subcategory, or description..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Tag Filter */}
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          tagCounts={tagCounts}
        />

        {/* Infinite Scroll List */}
        <InfiniteScroll
          dataLength={visiblePrompts.length}
          next={loadMorePrompts}
          hasMore={hasMore}
          loader={<h4 className="text-center my-4">Loading...</h4>}
          endMessage={<p className="text-center my-4">No more prompts</p>}
        >
          <List
            height={600} // Adjust based on your layout
            itemCount={visiblePrompts.length}
            itemSize={150} // Adjust based on your prompt item height
            width="100%"
          >
            {PromptItem}
          </List>
        </InfiniteScroll>

        {/* Selected Prompt Modal */}
        {selectedPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">{selectedPrompt.filename}</h2>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
                  onClick={() => setSelectedPrompt(null)}
                >
                  <FaTimes /> Close
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedPrompt.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prompt Content */}
              <div className="flex-1 overflow-y-auto">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedPrompt.content}
                    onChange={(e) => {
                      // Update the content in your state or context
                      setSelectedPrompt({ ...selectedPrompt, content: e.target.value });
                    }}
                    rows={15} // Set the number of visible lines to 15
                  />
                </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className={`px-4 py-2 ${
                    isCopied ? 'bg-green-500' : 'bg-blue-500'
                  } text-white rounded hover:bg-blue-600 flex items-center gap-2`}
                  onClick={handleCopy}
                >
                  {isCopied ? <FaCheck /> : <FaCopy />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;