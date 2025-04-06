// This is the list where the keywords go, which are searched for in the future accessed pages.
const dangerKeywords = ["corn", "kiss", "huzz", "rizz", "bet", "trallelo trallala"];

// Access the body of the table
const body = document.getElementById("stats-body");

// Retrieve blocked keyword stats from local storage
chrome.storage.local.get("blockedStats", (result) => {
  console.log("Blocked stats retrieved:", result); // DEBUG

  const stats = result.blockedStats || {};

  // Loop through the full list to ensure 0s are included
  dangerKeywords.forEach(keyword => {
    const count = stats[keyword] || 0;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${keyword}</td><td>${count}</td>`;
    body.appendChild(row);
  });
});
