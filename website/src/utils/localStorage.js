export const loadCustomTools = () => {
  const saved = localStorage.getItem('customTools');
  return saved ? JSON.parse(saved) : [];
};

export const saveCustomTools = (tools) => {
  localStorage.setItem('customTools', JSON.stringify(tools));
};

export const loadPromptUsageStats = () => {
  const saved = localStorage.getItem('promptUsageStats');
  return saved ? JSON.parse(saved) : {};
};

export const savePromptUsageStats = (stats) => {
  localStorage.setItem('promptUsageStats', JSON.stringify(stats));
};

export const loadToolUsageStats = () => {
  const saved = localStorage.getItem('toolUsageStats');
  return saved ? JSON.parse(saved) : {};
};

export const saveToolUsageStats = (stats) => {
  localStorage.setItem('toolUsageStats', JSON.stringify(stats));
};
