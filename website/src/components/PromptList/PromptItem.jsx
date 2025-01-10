// src/components/PromptList/PromptItem.jsx
import React from 'react';

const PromptItem = ({ index, prompts, onSelectPrompt, tagCounts }) => {
  const prompt = prompts[index];
  if (!prompt) return null;

  return (
    <div
      className="card p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onSelectPrompt(prompt)}
    >
      <h3 className="font-bold text-gray-900">{prompt.filename || "Unnamed Prompt"}</h3>
      <p className="mt-2 text-sm text-gray-700">{prompt.content.substring(0, 100)}...</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(prompt.tags || []).map((tag, tagIndex) => (
          <span
            key={`${tag}-${tagIndex}`}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
          >
            {tag} <span className="font-bold">({tagCounts[tag] || 0})</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromptItem;