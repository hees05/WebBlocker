chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("Message received in background:", message);

  if (message.type === "danger_detected" && message.keyword) {
    chrome.tabs.update(sender.tab.id, {
      url: chrome.runtime.getURL("warning.html") + `?reason=${encodeURIComponent(message.keyword)}`
    });
  }

  if (message.type === "close_and_open_google") {
    chrome.tabs.create({ url: "https://www.google.com" });
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  }

  return true; 
});
