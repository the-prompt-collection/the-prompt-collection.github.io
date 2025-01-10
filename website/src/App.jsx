import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash.debounce';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';
import prompts from './prompts/prompts.json';
import references from './references.json'; // Import the references file
import TagFilter from './components/TagFilter';
import Footer from './components/Footer';
import axios from 'axios';
import { load } from 'cheerio'; // Use named import for cheerio

// Logos (you can replace these with actual image URLs or SVGs)
const logos = {
  Gemini: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Google_Gemini_logo.svg',
  ChatGPT: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  DeepSeek: 'https://example.com/deepseek-logo.svg', // Replace with actual logo URL
  Grok: 'https://example.com/grok-logo.svg', // Replace with actual logo URL
  Perplexity: 'https://example.com/perplexity-logo.svg', // Replace with actual logo URL
};

const PAGE_SIZE = 50; // Number of prompts to load at a time

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [visiblePrompts, setVisiblePrompts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [referencesData, setReferencesData] = useState([]); // State for references data

  // Extract all unique tags from prompts
  const allTags = [...new Set(prompts.flatMap((prompt) => prompt.tags || []))];

  // Calculate the number of prompts for each tag
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = prompts.filter((prompt) => (prompt.tags || []).includes(tag)).length;
    return acc;
  }, {});

  // Sort tags by popularity (number of prompts)
  const sortedTags = allTags.sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Number of tags to show initially
  const INITIAL_TAGS_TO_SHOW = 5;

  // Slice the sorted tags array based on whether "Show More" is clicked
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, INITIAL_TAGS_TO_SHOW);

  // Calculate the total number of prompts
  const totalPrompts = prompts.length;

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

  // Handle starting a conversation with a selected website
  const handleStartConversation = (website, promptContent) => {
    // Copy the system prompt to the clipboard
    navigator.clipboard.writeText(promptContent).then(() => {
      setIsCopied(true); // Set copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });

    // Redirect to the selected platform
    let url = '';
    switch (website) {
      case 'Gemini':
        url = 'https://gemini.google.com/app';
        break;
      case 'ChatGPT':
        url = 'https://chatgpt.com/';
        break;
      case 'DeepSeek':
        url = 'https://chat.deepseek.com';
        break;
      case 'Grok':
        url = 'https://x.com/i/grok';
        break;
      case 'Perplexity':
        url = 'https://www.perplexity.ai/';
        break;
      default:
        return;
    }

    window.open(url, '_blank');
  };

  // Fetch reference data using a CORS proxy
  useEffect(() => {
    const fetchAllReferences = async () => {
      const data = await Promise.all(
        references.map(async (url) => {
          try {
            // Use a CORS proxy to bypass CORS restrictions
            const proxyUrl = `https://corsproxy.io/${url}`;
            const response = await axios.get(proxyUrl);
            const $ = load(response.data); // Use the named import `load`

            const title = $('title').text() || 'No Title';
            const description =
              $('meta[name="description"]').attr('content') ||
              $('p').first().text().substring(0, 100) + '...';

            return { title, description, url };
          } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return { title: 'Error', description: 'Unable to fetch data', url };
          }
        })
      );
      setReferencesData(data);
    };

    fetchAllReferences();
  }, []);

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
          {(prompt.tags || []).map((tag, tagIndex) => (
            <span
              key={`${tag}-${tagIndex}`}
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
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag} ({tagCounts[tag]})
              </button>
            ))}
          </div>
          {sortedTags.length > INITIAL_TAGS_TO_SHOW && (
            <button
              className="text-blue-500 hover:text-blue-700 text-sm mt-2"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

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

        {/* References Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Learn More About Prompt Engineering</h2>
          <div className="space-y-4">
            {referencesData.map((ref, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <h3 className="font-bold">{ref.title}</h3>
                </a>
                <p className="text-sm text-gray-600">{ref.description}</p>
              </div>
            ))}
          </div>
        </div>

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
                {(selectedPrompt.tags || []).map((tag, tagIndex) => (
                  <span
                    key={`${tag}-${tagIndex}`}
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
                <select
                  className="px-4 py-2 border border-gray-300 rounded"
                  onChange={(e) => {
                    const selectedWebsite = e.target.value;
                    if (selectedWebsite && selectedPrompt) {
                      handleStartConversation(selectedWebsite, selectedPrompt.content);
                    }
                  }}
                >
                  <option value="">Start a conversation with...</option>
                  {Object.entries(logos).map(([name, logo]) => (
                    <option key={name} value={name}>
                      <div className="flex items-center">
                        <img src={logo} alt={name} className="w-6 h-6 mr-2" />
                        {name}
                      </div>
                    </option>
                  ))}
                </select>

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

        {/* Notification for Copied Prompt */}
        {isCopied && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Prompt copied to clipboard! Paste it into the chat.
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;