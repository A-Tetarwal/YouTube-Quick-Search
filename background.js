chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchSuggestions") {
      fetch(`http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(request.query)}`)
        .then(response => response.json())
        .then(data => sendResponse(data[1]))
        .catch(error => console.error('Error fetching suggestions:', error));
      return true; // Keeps the message channel open for sendResponse
    }
  });
  