document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  fetch("/_data/prompts.json")
    .then((response) => response.json())
    .then((data) => {
      const fuse = new Fuse(data, {
        keys: ["category", "subcategory", "title", "content"],
      });

      searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value;
        const results = fuse.search(searchTerm);
        displayResults(results);
      });

      function displayResults(results) {
        searchResults.innerHTML = "";
        if (results.length === 0) {
          searchResults.innerHTML = "<p>No results found.</p>";
          return;
        }
        const list = document.createElement("ul");
        results.forEach((result) => {
          const item = document.createElement("li");
          item.textContent = `${result.item.category} - ${result.item.subcategory} - ${result.item.title}`;
          list.appendChild(item);
        });
        searchResults.appendChild(list);
      }
    });
  // Initialize Clipboard.js for copy buttons
  const clipboard = new ClipboardJS(".copy-button");

  clipboard.on("success", function (e) {
    console.log("Action:", e.action);
    console.log("Text:", e.text);
    console.log("Trigger:", e.trigger);
    // Optionally provide visual feedback to the user (e.g., changing button text)
    e.trigger.textContent = "Copied!";
    setTimeout(() => {
      e.trigger.textContent = "Copy";
    }, 2000);
    e.clearSelection();
  });

  clipboard.on("error", function (e) {
    console.error("Action:", e.action);
    console.error("Trigger:", e.trigger);
    // Handle errors (e.g., if the browser doesn't support Clipboard API)
    e.trigger.textContent = "Press Ctrl+C to copy";
  });
});
