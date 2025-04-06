import { db } from './firebase.js';
import { doc, setDoc,increment } from 'firebase/firestore';

const dangerKeywords = ["corn", "kiss", "huzz", "rizz", "bet", "trallelo trallala"];

chrome.runtime.onInstalled.addListener(() => {
  dangerKeywords.forEach(async (keyword) => {
    const ref = doc(db, "keywordStats", keyword.toLowerCase());
    await setDoc(ref, { count: 0 }, { merge: true }); // merge avoids overwriting
  });
});


// This checks for messages from content.js or warning.js files.
// This checks for messages from content.js or warning.js files.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    console.log("Message received in background:", message);

    // If a dangerous keyword was detected, save it and redirect to warning.html
    if (
      message.type === "danger_detected" &&
      message.keyword &&
      !sender.tab.url.includes("warning.html")
    ) {
      const keyword = message.keyword.toLowerCase();
      const ref = doc(db, "keywordStats", keyword);

      // ✅ Increment keyword count in Firestore
      await setDoc(ref, { count: increment(1) }, { merge: true });

      // ✅ Redirect user to warning.html
      chrome.tabs.update(sender.tab.id, {
        url: chrome.runtime.getURL("warning.html") + `?reason=${encodeURIComponent(keyword)}`
      });
    }

    // If the user clicked "Go Back", open Google and close the current tab
    if (message.type === "close_and_open_google") {
      chrome.tabs.create({ url: "https://www.google.com" }); // Open new Google tab
      if (sender.tab && sender.tab.id) {
        chrome.tabs.remove(sender.tab.id); // Close warning tab
      }
    }

    sendResponse(); // optional callback to indicate completion
  })();

  return true; // Good practice to keep listener alive for async ops
});
