import React from 'react';
import { Zap } from 'lucide-react';
import aiTools from '../../data/ai-tools.json'; // added import

// New helper: Get the most frequent AI tool based on local usage stats (using aiTools)
const getMostFrequentTool = () => {
  const stats = JSON.parse(localStorage.getItem('toolUsageStats')) || {};
  const allTools = [...aiTools.tools];
  let maxUsage = -1;
  allTools.forEach(tool => {
    const usage = stats[tool.name] || 0;
    if (usage > maxUsage) {
      maxUsage = usage;
    }
  });
  const candidates = allTools.filter(tool => (stats[tool.name] || 0) === maxUsage);
  if (candidates.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
};

const PromptItem = ({ prompt, onSelectPrompt, onQuickAction }) => {
  return (
    <div
      onClick={() => onSelectPrompt(prompt)}
      // Removed transform and hover scale classes to reduce lag; retained cursor-pointer
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-3 h-full"
    >
      {/* Modified header: usage count and Quick Action small button with dynamic label */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {prompt.usageCount !== undefined ? prompt.usageCount : 0}{' '}
          {(prompt.usageCount === 0)
            ? <span role="img" aria-label="no usage">😴</span>
            : <span role="img" aria-label="usage count">🔥</span>}
        </span>
        {onQuickAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction(prompt);
            }}
            className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1"
          >
            <Zap size={16} />
            {getMostFrequentTool() ? getMostFrequentTool().name : ''}
          </button>
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

      {/* Updated footer: show tags list with special highlighting for category and system tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {prompt.tags && prompt.tags.length > 0 && prompt.tags.map((tag, i) => {
          let classes = "px-2 py-1 rounded text-xs";
          if (tag === 'system') {
            classes += " bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100 font-bold";
          } else if (tag === prompt.category) {
            classes += " bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100 font-bold";
          } else {
            classes += " bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
          }
          return (
            <span key={i} className={classes}>
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PromptItem;
