// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import TagFilter from './components/TagFilter/TagFilter';
import PromptList from './components/PromptList/PromptList';
import ReferencesSection from './components/ReferencesSection/ReferencesSection';
import SelectedPromptModal from './components/SelectedPromptModal/SelectedPromptModal';
import Footer from './components/Footer/Footer';
import prompts from './prompts/prompts.json';
import references from './references.json';
import axios from 'axios';
import { load } from 'cheerio';
import debounce from 'lodash.debounce';

const PAGE_SIZE = 20; // Number of prompts to load at a time

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [visiblePrompts, setVisiblePrompts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [referencesData, setReferencesData] = useState([]);
  const [customTools, setCustomTools] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load custom tools from localStorage on initial render
  useEffect(() => {
    const storedTools = JSON.parse(localStorage.getItem('customTools')) || [];
    setCustomTools(storedTools);
  }, []);

  // Save custom tools to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customTools', JSON.stringify(customTools));
  }, [customTools]);

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
  const INITIAL_TAGS_TO_SHOW = 10;

  // Slice the sorted tags array based on whether "Show More" is clicked
  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, INITIAL_TAGS_TO_SHOW);

  // Calculate the total number of prompts
  const totalPrompts = prompts.length;

  // Group prompts by category
  const groupedPrompts = prompts.reduce((acc, prompt) => {
    const category = prompt.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(prompt);
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
    const filtered = selectedCategory ? groupedPrompts[selectedCategory] : filterPrompts();
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
    console.log(filtered);
    setVisiblePrompts(filtered.slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filtered.length > PAGE_SIZE);
  }, [searchQuery, selectedTags, filterPrompts]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setVisiblePrompts(groupedPrompts[category].slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(groupedPrompts[category].length > PAGE_SIZE);
  };

  // Handle back to category view
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setVisiblePrompts(filterPrompts().slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filterPrompts().length > PAGE_SIZE);
  };

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
        // Check if the website is a custom tool
        const customTool = customTools.find((tool) => tool.name === website);
        if (customTool) {
          url = customTool.url;
        } else {
          return;
        }
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

  // Handle adding a custom tool
  const handleAddCustomTool = (toolName, toolUrl) => {
    const newTool = { name: toolName, url: toolUrl };
    setCustomTools((prev) => [...prev, newTool]);
  };

  // Handle deleting a custom tool
  const handleDeleteCustomTool = (toolName) => {
    setCustomTools((prev) => prev.filter((tool) => tool.name !== toolName));
  };

  // Handle modifying a custom tool
  const handleModifyCustomTool = (oldName, newName, newUrl) => {
    setCustomTools((prev) =>
      prev.map((tool) =>
        tool.name === oldName ? { name: newName, url: newUrl } : tool
      )
    );
  };

  // Determine whether to show the category list or filtered prompts
  const showCategoryList = !searchQuery && selectedTags.length === 0 && !selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Header totalPrompts={totalPrompts} />
        <SearchBar onSearch={handleSearch} />
        <TagFilter
          tags={visibleTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          showAllTags={showAllTags}
          onToggleShowAllTags={() => setShowAllTags(!showAllTags)}
          tagCounts={tagCounts}
        />
        <PromptList
          prompts={visiblePrompts}
          loadMorePrompts={loadMorePrompts}
          hasMore={hasMore}
          onSelectPrompt={setSelectedPrompt}
          tagCounts={tagCounts}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
          onBackToCategories={handleBackToCategories}
          groupedPrompts={groupedPrompts}
          showCategoryList={showCategoryList}
        />
        <ReferencesSection referencesData={referencesData} />
        {selectedPrompt && (
          <SelectedPromptModal
            selectedPrompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
            onCopy={handleCopy}
            isCopied={isCopied}
            onStartConversation={handleStartConversation}
            customTools={customTools}
            onAddCustomTool={handleAddCustomTool}
            onDeleteCustomTool={handleDeleteCustomTool}
            onModifyCustomTool={handleModifyCustomTool}
          />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default App;