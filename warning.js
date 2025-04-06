//chrome doesn't allow inline javascript in extension pages like warning.html becasue of its strict Content Security Policy. 

document.addEventListener("DOMContentLoaded", () => {
    const goBackButton = document.getElementById("goBack");
    if (goBackButton) {
      goBackButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "close_and_open_google" });
      });
    }
  });
  