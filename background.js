chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "danger_detected") {
    // Here you could fetch more info if needed
    chrome.tabs.update(sender.tab.id, {
      url: chrome.runtime.getURL("warning.html")
    });
  }
});
