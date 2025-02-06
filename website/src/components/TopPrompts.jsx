import React from 'react';

const TopPrompts = ({ topPrompts, handleSelectPrompt }) => {
  if (!topPrompts || topPrompts.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Top 5 Frequent Prompts
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {topPrompts.map((prompt) => (
          <li
            key={prompt.filename}
            onClick={() => handleSelectPrompt(prompt)}
            className="py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <span className="flex-1">
                {prompt.title || prompt.filename || 'Untitled Prompt'}
              </span>
              {prompt.tags && prompt.tags.map((tag, i) => {
                let classes = "px-1 py-0.5 rounded text-xs";
                if (tag === 'system') {
                  classes += " bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100";
                } else if (tag === prompt.category) {
                  classes += " bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100";
                } else {
                  classes += " bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
                }
                return (
                  <span key={i} className={classes}>
                    {tag}
                  </span>
                );
              })}
              {/* Updated usage count with conditional icon */}
              <span className="px-2 py-0.5 rounded text-xs bg-green-200 text-green-800">
                {prompt.usageCount !== undefined ? prompt.usageCount : 0} { (prompt.usageCount === 0) ? <span role="img" aria-label="no usage">😴</span> : <span role="img" aria-label="usage count">🔥</span> }
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TopPrompts;
