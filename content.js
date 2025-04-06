const dangerKeywords = ["gamble", "bet", "casino"];

const bodyText = document.body.innerText.toLowerCase();
const foundKeyword = dangerKeywords.find(k => bodyText.includes(k));

if (foundKeyword) {
  chrome.runtime.sendMessage({
    type: "danger_detected",
    keyword: foundKeyword,
    url: window.location.href
  });

  // Highlight keywords only after detection
  dangerKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
      return `<mark style="background-color: yellow">${match}</mark>`;
    });
  });
}
