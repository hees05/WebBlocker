//This is the list where the keywords go, which are searched for in the future accessed pages.
const dangerKeywords = ["corn", "kiss", "huzz", "rizz", "bet", "trallelo trallala"];

//Get all visible text on the page and converts them into lowercase letter, so they can be compared with the words in the list.
const bodyText = document.body.innerText.toLowerCase();

//checks if any of the keywords in dangerKeywords are found from the body text.
const foundKeyword = dangerKeywords.find(k => bodyText.includes(k));

//when a restricted keyword is found, it will be notified to background.js
if (foundKeyword) {
  chrome.runtime.sendMessage({
    type: "danger_detected",
    keyword: foundKeyword,
    url: window.location.href
  });

  //This allows the highlight in the page, which I thought might be useful if the user was searching on the webpage based on the keyword.
  dangerKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
      return `<mark style="background-color: yellow">${match}</mark>`;
    });
  });
}
