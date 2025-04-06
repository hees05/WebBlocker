// This checks for messages from content.js or warning.js files.
chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("Message received in background:", message);

  // If a dangerous keyword was detected, save it and redirect to warning.html
  if (message.type === "danger_detected" && message.keyword) {
    chrome.storage.local.get(["blockedStats"], (result) => {
      const stats = result.blockedStats || {};
      const keyword = message.keyword.toLowerCase();
      stats[keyword] = (stats[keyword] || 0) + 1;

      // ✅ Redirect AFTER stats are saved
      chrome.storage.local.set({ blockedStats: stats }, () => {
        chrome.tabs.update(sender.tab.id, {
          url: chrome.runtime.getURL("warning.html") + `?reason=${encodeURIComponent(message.keyword)}`
        });
      });
    });
  }

  // If the user clicked "Go Back", open Google and close the current tab
  if (message.type === "close_and_open_google") {
    chrome.tabs.create({ url: "https://www.google.com" }); // Open new Google tab
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id); // Close warning tab
    }
  }

  return true; // Good practice for async handling
});
