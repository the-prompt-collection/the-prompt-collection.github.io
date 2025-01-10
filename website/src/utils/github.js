export const fetchRepoData = async () => {
  const response = await fetch('https://api.github.com/repos/the-prompt-collection/the-prompt-collection');
  if (!response.ok) {
    throw new Error('Failed to fetch GitHub repository data');
  }
  return response.json();
};