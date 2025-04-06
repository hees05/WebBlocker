import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// FIrebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQtixiF4PBJ2R18-wzAoVjFLbjGa8EKKA",
  authDomain: "webblocker-248d8.firebaseapp.com",
  projectId: "webblocker-248d8",
  storageBucket: "webblocker-248d8.appspot.com",  // Fixed the bucket domain
  messagingSenderId: "551506044307",
  appId: "1:551506044307:web:4900e206c3add37a6af466",
  measurementId: "G-1EZQ4VXK84"
};

// Initialising firebase and firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//exporting firebase instance for other files to be used. 
export { db };
