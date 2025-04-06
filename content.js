// Importing Firebase app and Firestore SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase config – same as your firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyAQtixiF4PBJ2R18-wzAoVjFLbjGa8EKKA",
  authDomain: "webblocker-248d8.firebaseapp.com",
  projectId: "webblocker-248d8",
  storageBucket: "webblocker-248d8.appspot.com",
  messagingSenderId: "551506044307",
  appId: "1:551506044307:web:4900e206c3add37a6af466",
  measurementId: "G-1EZQ4VXK84"
};

// Initialise Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔍 Scan page for blocked words from Firebase
(async () => {
  // Get all visible text on the page and lowercase it
  const bodyText = document.body.innerText.toLowerCase();

  // Get blocked keywords from Firestore
  const snapshot = await getDocs(collection(db, "keywordStats"));
  const keywords = snapshot.docs.map(doc => doc.id.toLowerCase());

  // Check if any keyword is found in the page
  const foundKeyword = keywords.find(k => bodyText.includes(k));

  // If a restricted word is found, notify background.js
  if (foundKeyword) {
    chrome.runtime.sendMessage({
      type: "danger_detected",
      keyword: foundKeyword,
      url: window.location.href
    });

    // Optional: highlight the word in the page
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
        return `<mark style="background-color: yellow">${match}</mark>`;
      });
    });
  }
})();
