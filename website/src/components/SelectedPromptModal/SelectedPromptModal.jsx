// src/components/SelectedPromptModal/SelectedPromptModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaCopy, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

// Logos (you can replace these with actual image URLs or SVGs)
const logos = {
  Gemini: 'https://www.pngall.com/wp-content/uploads/16/Google-Gemini-Logo-PNG-Cutout-thumb.png',
  ChatGPT: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ChatGPT-Logo.png',
  DeepSeek: 'https://logowik.com/content/uploads/images/deepseek-ai4760.logowik.com.webp', // Replace with actual logo URL
  Grok: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Logo_Grok_AI_%28xAI%29_2025.png', // Replace with actual logo URL
  Perplexity: 'https://uxwing.com/wp-content/uploads/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png', // Replace with actual logo URL
};

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-gray-100">
            {selectedPrompt.filename}
          </h2>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            <FaTimes /> Close
          </button>
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
          <textarea
            className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            value={selectedPrompt.content}
            rows={15}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            onChange={(e) => {
              const selectedWebsite = e.target.value;
              if (selectedWebsite === 'add-custom-tool') {
                setShowCustomToolForm(true);
              } else if (selectedWebsite && selectedPrompt) {
                onStartConversation(selectedWebsite, selectedPrompt.content);
              }
            }}
          >
            <option value="">Select an AI</option>
            {Object.entries(logos).map(([name]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            {customTools.map((tool) => (
              <option key={tool.name} value={tool.name}>
                {tool.name}
              </option>
            ))}
            <option value="add-custom-tool">Add New AI</option>
          </select>
          <button
            className={`px-4 py-2 ${
              isCopied ? 'bg-green-500' : 'bg-blue-500'
            } text-white rounded hover:bg-blue-600 flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700`}
            onClick={onCopy}
          >
            {isCopied ? <FaCheck /> : <FaCopy />}
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {showCustomToolForm && (
          <form onSubmit={handleAddOrUpdateTool} className="mt-4">
            <div className="flex gap-2">
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {editingTool ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-black dark:text-gray-100">Custom AI</h3>
          <ul className="space-y-2">
            {customTools.map((tool, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border border-gray-200 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <span className="text-gray-900 dark:text-gray-100">{tool.name}</span>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                    onClick={() => {
                      setEditingTool(tool);
                      setToolName(tool.name);
                      setToolUrl(tool.url);
                      setShowCustomToolForm(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    onClick={() => onDeleteCustomTool(tool.name)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectedPromptModal;