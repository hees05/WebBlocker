// statistics.js
import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore';

document.addEventListener("DOMContentLoaded", async () => {
  const body = document.getElementById("stats-body");

  const snapshot = await getDocs(collection(db, "keywordStats"));

  snapshot.forEach(doc => {
    const keyword = doc.id;
    const count = doc.data().count || 0;

    const row = document.createElement("tr");
    row.innerHTML = `<td>${keyword}</td><td>${count}</td>`;
    body.appendChild(row);
  });
});
