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
import aiTools from './data/ai-tools.json';

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
  const [customTools, setCustomTools] = useState(() => {
    // Initialize from localStorage on component mount
    const saved = localStorage.getItem('customTools');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showHero, setShowHero] = useState(true);

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
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });

    // Find the tool URL from either ai-tools.json or custom tools
    const predefinedTool = aiTools.tools.find(tool => tool.name === website);
    const customTool = customTools.find(tool => tool.name === website);

    let url = '';
    if (predefinedTool) {
      url = predefinedTool.url;
    } else if (customTool) {
      url = customTool.url;
    } else {
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
            const proxyUrl = `https://corsproxy.io/${url}`;
            const response = await axios.get(proxyUrl);
            const $ = load(response.data);

            // Get clean title
            const title = $('title').text().split('|')[0].trim() || 'No Title';

            // Get meta description or first paragraph
            let description = $('meta[name="description"]').attr('content');
            if (!description) {
              // Get first 2-3 sentences from first paragraph
              const firstPara = $('p').first().text();
              const sentences = firstPara.match(/[^.!?]+[.!?]+/g) || [];
              description = sentences.slice(0, 2).join(' ').trim();
            }

            // Get source name from URL
            const source = new URL(url).hostname
              .replace('www.', '')
              .split('.')
              .slice(0, -1)
              .join('.')
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return {
              title,
              description: description || 'No description available.',
              url,
              source
            };
          } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return {
              title: 'Error loading resource',
              description: 'Unable to fetch content. Please check the original source.',
              url,
              source: new URL(url).hostname.replace('www.', '')
            };
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

  // Enhanced URL parameter handling
  useEffect(() => {
    const handleUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const sharedPromptName = params.get('prompt');

      if (sharedPromptName) {
        const promptToShow = prompts.find(p => p.filename === decodeURIComponent(sharedPromptName));
        if (promptToShow) {
          setSelectedPrompt(promptToShow);
        }
      }
    };

    // Handle initial load and browser back/forward
    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);

    return () => window.removeEventListener('popstate', handleUrlParams);
  }, []);

  // Update URL when modal opens/closes
  useEffect(() => {
    const url = new URL(window.location);

    if (selectedPrompt) {
      url.searchParams.set('prompt', encodeURIComponent(selectedPrompt.filename));
    } else {
      url.searchParams.delete('prompt');
    }

    // Only update if URL actually changed to avoid unnecessary history entries
    if (url.toString() !== window.location.href) {
      window.history.pushState({}, '', url);
    }
  }, [selectedPrompt]);

  // Handle modal close via browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (!new URLSearchParams(window.location.search).has('prompt')) {
        setSelectedPrompt(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL with selected filters
  const updateUrlWithFilters = useCallback(() => {
    const url = new URL(window.location);

    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }

    if (selectedTags.length > 0) {
      url.searchParams.set('tags', selectedTags.join(','));
    } else {
      url.searchParams.delete('tags');
    }

    window.history.pushState({}, '', url);
  }, [selectedCategory, selectedTags]);

  // Handle initial URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const tagsParam = params.get('tags');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setVisiblePrompts(groupedPrompts[categoryParam]?.slice(0, PAGE_SIZE) || []);
      setShowHero(false);
    }

    if (tagsParam) {
      const tags = tagsParam.split(',');
      setSelectedTags(tags);
      setShowHero(false);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    updateUrlWithFilters();
    setShowHero(!selectedCategory && selectedTags.length === 0);
  }, [selectedCategory, selectedTags, updateUrlWithFilters]);

  // Determine whether to show the category list or filtered prompts
  const showCategoryList = !searchQuery && selectedTags.length === 0 && !selectedCategory;

  const getFilterShareContent = () => {
    const parts = [];
    if (selectedCategory) parts.push(`category: ${selectedCategory}`);
    if (selectedTags.length) parts.push(`tags: ${selectedTags.join(', ')}`);
    return `Check out these prompts ${parts.join(' and ')} from The Prompt Collection`;
  };

  // Get total number of filtered prompts
  const getTotalFilteredPrompts = useCallback(() => {
    if (selectedCategory) {
      return groupedPrompts[selectedCategory]?.length || 0;
    }
    return filterPrompts().length;
  }, [selectedCategory, filterPrompts, groupedPrompts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Header />

        {showHero && (
          <div className="flex flex-col items-center justify-center py-16 space-y-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                Your Gateway to AI Conversations
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Discover and use curated prompts to enhance your AI interactions
              </p>
            </div>
          </div>
        )}

        {/* Search and Filters Section - Show search only when no filters are active */}
        <div className={`flex flex-col items-center justify-center ${showHero ? '' : 'py-2'} ${selectedTags.length > 0 ? 'space-y-2' : 'space-y-4'}`}>
          {(!selectedCategory && selectedTags.length === 0) && (
            <div className="w-full max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}

          <div className="w-full max-w-4xl mx-auto">
            <TagFilter
              tags={visibleTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              showAllTags={showAllTags}
              onToggleShowAllTags={() => setShowAllTags(!showAllTags)}
              tagCounts={tagCounts}
              onShareFilters={() => {}}
              showShareButton={!showHero}
              shareContent={getFilterShareContent()}
              shareTitle="Filtered Prompts - The Prompt Collection"
            />
          </div>
        </div>

        {/* Prompts List with reduced margin when filters are active */}
        <div className={`${(!showHero && (selectedCategory || selectedTags.length > 0)) ? 'mt-2' : 'mt-8'}`}>
          <PromptList
            prompts={visiblePrompts}
            loadMorePrompts={loadMorePrompts}
            hasMore={hasMore}
            onSelectPrompt={setSelectedPrompt}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            onBackToCategories={handleBackToCategories}
            groupedPrompts={groupedPrompts}
            showCategoryList={showCategoryList}
            totalPrompts={totalPrompts}
            totalFilteredPrompts={getTotalFilteredPrompts()}
          />
        </div>

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