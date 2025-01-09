document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  fetch('/_data/prompts.json')
      .then(response => response.json())
      .then(data => {
          const fuse = new Fuse(data, {
              keys: ['category', 'subcategory', 'title', 'content']
          });

          searchInput.addEventListener('input', function() {
              const searchTerm = searchInput.value;
              const results = fuse.search(searchTerm);
              displayResults(results);
          });

          function displayResults(results) {
              searchResults.innerHTML = '';
              if (results.length === 0) {
                  searchResults.innerHTML = '<p>No results found.</p>';
                  return;
              }
              const list = document.createElement('ul');
              results.forEach(result => {
                  const item = document.createElement('li');
                  item.textContent = `${result.item.category} - ${result.item.subcategory} - ${result.item.title}`;
                  list.appendChild(item);
              });
              searchResults.appendChild(list);
          }
      });
});