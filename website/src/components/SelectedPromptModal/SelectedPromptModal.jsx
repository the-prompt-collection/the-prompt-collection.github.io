// src/components/SelectedPromptModal/SelectedPromptModal.jsx
import React, { useState, useEffect } from 'react';
import { disableScroll, enableScroll } from '../../utils/scrollLock';
import { X, Copy, Check, Edit, Trash2, Plus, Save } from 'lucide-react';
import ShareButton from '../ShareButton/ShareButton';
import '../../styles/animations.css';
import aiTools from '../../data/ai-tools.json';

const SelectedPromptModal = ({
  selectedPrompt,
  onClose,
  onCopy,
  isCopied,
  onStartConversation,
  customTools,
  onAddCustomTool,
  onDeleteCustomTool,
  onModifyCustomTool,
}) => {
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [showCustomToolForm, setShowCustomToolForm] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [selectedAITool, setSelectedAITool] = useState(null);

  useEffect(() => {
    disableScroll();
    return () => {
      enableScroll();
    };
  }, []);

  const handleAddOrUpdateTool = (e) => {
    e.preventDefault();
    if (toolName && toolUrl) {
      if (editingTool) {
        onModifyCustomTool(editingTool.name, toolName, toolUrl);
      } else {
        onAddCustomTool(toolName, toolUrl);
      }
      setToolName('');
      setToolUrl('');
      setShowCustomToolForm(false);
      setEditingTool(null);
    }
  };

  const generateShareMessage = () => {
    return `Check out this AI prompt: "${selectedPrompt.filename}" from The Prompt Collection`;
  };

  // Generate the full sharing URL with prompt parameter
  const getShareUrl = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set('prompt', encodeURIComponent(selectedPrompt.filename));
    return url.toString();
  };

  const shareContent = `Check out this prompt "${selectedPrompt.title || selectedPrompt.filename}" from The Prompt Collection`;

  const handleSelectChange = (e) => {
    const selectedWebsite = e.target.value;
    if (selectedWebsite === 'add-custom-tool') {
      setShowCustomToolForm(true);
      // Check if Open WebUI already exists in customTools
      const hasOpenWebUI = customTools.some(tool => tool.name.toLowerCase() === 'openwebui');
      if (!hasOpenWebUI) {
        setToolName('OpenWebUI');
        setToolUrl('http://localhost:3000');
      }
      setSelectedAITool(null);
    } else if (selectedWebsite && selectedPrompt) {
      const tool = aiTools.tools.find(t => t.name === selectedWebsite) ||
                  customTools.find(t => t.name === selectedWebsite);
      setSelectedAITool(tool);
      onStartConversation(selectedWebsite, selectedPrompt.content);
    } else {
      setSelectedAITool(null);
    }
  };

  const renderOption = (name, url) => (
    <option
      key={name}
      value={name}
      title={url} // Add title attribute for native tooltip
      className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2" // Add hover styles
    >
      {name}
    </option>
  );

  return (
    <div className="fixed inset-0 z-50" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-screen items-start sm:items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-3 sm:p-6 overflow-hidden shadow-2xl animate-modal-entry">
          {/* Modal header with new styling */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b dark:border-gray-700 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 pr-8">
              {selectedPrompt.title || selectedPrompt.filename}
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <ShareButton
                url={getShareUrl()}
                text="Share"
                content={shareContent}
                title={selectedPrompt.title || selectedPrompt.filename}
              />
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(selectedPrompt.tags || []).map((tag, tagIndex) => (
              <span
                key={`${tag}-${tagIndex}`}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm dark:bg-gray-700 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              You can modify this prompt before using it:
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              defaultValue={selectedPrompt.content}
              rows={15}
              readOnly
            />
          </div>
          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Start a Conversation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose an AI platform to start a conversation with this prompt. The prompt will be copied to your clipboard automatically when you select a platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <select
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  onChange={handleSelectChange}
                  value={selectedAITool?.name || ''}
                >
                  <option value="">Select an AI</option>
                  {aiTools.tools.map((tool) => renderOption(tool.name, tool.url))}
                  {customTools.map((tool) => renderOption(tool.name, tool.url))}
                  <option value="add-custom-tool">Add New AI</option>
                </select>

                <button
                  className={`w-full sm:w-auto px-4 py-2 ${
                    isCopied ? 'bg-green-500' : 'bg-blue-500'
                  } text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700`}
                  onClick={onCopy}
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          {showCustomToolForm && (
            <div className="mt-6 border-t dark:border-gray-700 pt-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Add Custom AI Tool
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define your own AI tool or local setup. When selected, the prompt will be copied and the specified URL will be opened.
                </p>
              </div>
              <form onSubmit={handleAddOrUpdateTool} className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Tool Name"
                    className="p-2 border border-gray-300 rounded flex-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Tool URL"
                    className="p-2 border border-gray-300 rounded flex-1 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-2"
                  >
                    {editingTool ? <Save size={18} /> : <Plus size={18} />}
                    {editingTool ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          )}
          {customTools.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-black dark:text-gray-100 mb-2">Custom AI Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Your saved custom AI tools. These can be local setups, self-hosted models, or any other AI platforms you use.
              </p>
              <ul className="space-y-2">
                {customTools.map((tool, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {tool.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tool.url}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                        onClick={() => {
                          setEditingTool(tool);
                          setToolName(tool.name);
                          setToolUrl(tool.url);
                          setShowCustomToolForm(true);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        onClick={() => onDeleteCustomTool(tool.name)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedPromptModal;