// Search button click event
document.getElementById('searchButton').addEventListener('click', function() {
  performSearch();
});

// Event listener for "Enter" key press in the input field
document.getElementById('searchQuery').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
      performSearch();
  }
});

// Function to perform the search
function performSearch() {
  const query = document.getElementById('searchQuery').value;

  if (query) {
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      chrome.tabs.create({ url: youtubeSearchUrl });
  }
}
