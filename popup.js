// Get DOM elements
const searchInput = document.getElementById("searchQuery");
const suggestionsList = document.getElementById("suggestions");

// Variables to manage suggestions and current selection
let currentSelectionIndex = -1; // No suggestion selected initially
let originalInputValue = ""; // Store the original input value

// Search button click event
document.getElementById("searchButton").addEventListener("click", function () {
  performSearch(searchInput.value);
});

// Debouncing timer
let debounceTimer;

// Event listener for "Enter" key press in the input field
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // If a suggestion is selected, use it; otherwise, use the input value
    const searchQuery =
      currentSelectionIndex >= 0
        ? suggestionsList.children[currentSelectionIndex].textContent
        : searchInput.value;

    performSearch(searchQuery);
    event.preventDefault(); // Prevent form submission
  } else if (event.key === "ArrowDown") {
    // Move down the suggestions
    if (currentSelectionIndex < suggestionsList.children.length - 1) {
      currentSelectionIndex++;
      updateSuggestionHighlight();
    }
    event.preventDefault(); // Prevent default scrolling
  } else if (event.key === "ArrowUp") {
    // Move up the suggestions
    if (currentSelectionIndex > 0) {
      currentSelectionIndex--;
      updateSuggestionHighlight();
    } else if (currentSelectionIndex === 0) {
      // If already at the first suggestion, reset input to original value
      searchInput.value = originalInputValue;
      currentSelectionIndex = -1; // Reset selection index
      // Do NOT clear suggestions here to keep them visible
    }
    event.preventDefault(); // Prevent default scrolling
  }
});

// Event listener for input event to fetch suggestions as the user types
searchInput.addEventListener("input", function () {
  const query = searchInput.value;

  // Store the original input value on the first key press
  if (!originalInputValue) {
    originalInputValue = query;
  }

  // Debounce API request to reduce the load
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    if (query) {
      fetchTextSuggestions(query);
    } else {
      suggestionsList.innerHTML = ""; // Clear suggestions when input is empty
      currentSelectionIndex = -1; // Reset the selection index
      originalInputValue = ""; // Clear the original input value
    }
  }, 300); // Debounce time set to 300ms
});

// Function to perform the search
function performSearch(query) {
  if (query) {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}`;
    chrome.tabs.create({ url: youtubeSearchUrl });
  }
}

// Function to fetch text suggestions
function fetchTextSuggestions(query) {
  chrome.runtime.sendMessage(
    { action: "fetchSuggestions", query: query },
    (suggestions) => {
      displaySuggestions(suggestions);
    }
  );
}

// Function to display search suggestions
function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = ""; // Clear previous suggestions
  currentSelectionIndex = -1; // Reset the selection index

  suggestions.forEach((suggestion, index) => {
    const li = document.createElement("li");
    li.className = "suggestion-item";
    li.textContent = suggestion; // Display the suggestion text

    // Click event to perform search with the suggestion
    li.addEventListener("click", function () {
      performSearch(suggestion); // Perform search with the clicked suggestion
      searchInput.value = suggestion; // Update input value with the suggestion
    });

    suggestionsList.appendChild(li); // Add the list item to the suggestions list
  });
}

// Function to highlight the selected suggestion
function updateSuggestionHighlight() {
  const items = suggestionsList.children;

  // Remove the highlight from all items
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("highlight");
  }

  // Highlight the currently selected suggestion
  if (currentSelectionIndex >= 0 && currentSelectionIndex < items.length) {
    items[currentSelectionIndex].classList.add("highlight");
    searchInput.value = items[currentSelectionIndex].textContent; // Update input with the highlighted suggestion
  }
}
