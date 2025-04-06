//chrome doesn't allow inline javascript in extension pages like warning.html becasue of its strict Content Security Policy. 

document.addEventListener("DOMContentLoaded", () => {
    const goBackButton = document.getElementById("goBack");
    if (goBackButton) {
      goBackButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "close_and_open_google" });
      });
    }
      // Show the keyword that triggered the block
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get("reason");

    if (reason) {
        const reasonDiv = document.getElementById("reason");
        if (reasonDiv) {
        reasonDiv.textContent = `You were denied access due to the keyword: “${reason}”.`;
        }
    }
  });
  