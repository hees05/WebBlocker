// Optional: import Neuphonic if using a bundler
// import { createBrowserClient } from '@neuphonic/neuphonic-js/browser';


//This will show the deleted/added word for 10 seconds. 
function showTemporaryBanner(message, type = "info") {
    const banner = document.createElement("div");
    banner.textContent = message;
    banner.style.position = "fixed";
    banner.style.top = "20px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.padding = "10px 20px";
    banner.style.borderRadius = "8px";
    banner.style.zIndex = 9999;
    banner.style.fontSize = "1rem";
    banner.style.fontWeight = "bold";
    banner.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    banner.style.transition = "opacity 0.3s ease";
  
    // Style based on message type
    switch (type) {
      case "success":
        banner.style.backgroundColor = "#4CAF50";
        banner.style.color = "#fff";
        break;
      case "error":
        banner.style.backgroundColor = "#f44336";
        banner.style.color = "#fff";
        break;
      default:
        banner.style.backgroundColor = "#333";
        banner.style.color = "#fff";
    }
  
    document.body.appendChild(banner);
  
    // Auto remove after 10 seconds
    setTimeout(() => {
      banner.style.opacity = 0;
      setTimeout(() => banner.remove(), 500);
    }, 10000);
  }
  
//This waits for the page to load
document.addEventListener("DOMContentLoaded", async () => {
    const goBackButton = document.getElementById("goBack");
    const reasonDiv = document.getElementById("reason");
    const liveMsg = document.getElementById("live-message");

    // Show instructions modal when button is clicked
    const instructionsBtn = document.getElementById("viewInstructions");
    if (instructionsBtn) {
    instructionsBtn.addEventListener("click", () => {
        document.getElementById("instructionsModal").style.display = "flex";
    });
}

    // Setup listener for the statistics button on the warning.html page
    // Opens stats.html in a new browser tab
    const viewStatsButton = document.getElementById("viewStats");
    if (viewStatsButton) {
    viewStatsButton.addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("statistics.html") });
    });
    }

  
    // Gets the blocked keyword from the URL/page.
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("reason") || "a restricted keyword";
    reasonDiv.textContent = `You were denied access due to the keyword: “${keyword}”.`;
  
    //Setting up the neuphonic customer to speak the warning out loud (danger keyword search up prevention purposes)
    try {
      const client = createBrowserClient(); // Already installed via npm
      client.jwt('33337f8903cfc261181d2b064169b10f4af6bec1d991e696e5cbc648aadf08ab.0eec2a3d-f1a6-4166-ae04-1f5ddb4b1a0e'); // Replace with actual JWT
  
      const tts = await client.tts.websocket({
        speed: 1.1,
        lang_code: 'en',
        voice_id: 'fc854436-2dac-4d21-aa69-ae17b54e98eb' //This is Emily, who's from England and energetic. 
      });
  
      const speech = `Access denied. You tried to access a page with the word "${keyword}". Please repeat after me: I will not search up ${keyword} again.`;
      
      //Playing the AI audio
      for await (const chunk of tts.send(speech)) {
        const audio = new Audio(URL.createObjectURL(new Blob([chunk.audio])));
        audio.play();
      }
    } catch (err) {
      console.error("Failed to use Neuphonic TTS:", err);
      liveMsg.textContent = "Voice could not be played. Please repeat the phrase manually.";
    }
  
    // This sets up the browser voice recognition API!
    const expectedPhrase = `i will not search up ${keyword} again`;
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
  
    //This gets executed once the user finishes speaking.
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("You said:", transcript);
      
        //Unlocks the go back button to the search bar
        if (transcript.includes(expectedPhrase)) {
          goBackButton.disabled = false;
          liveMsg.textContent = "Phrase accepted. You may now go back.";
          return;
        }
      
        //Allows the users to add keyword in the list.
        const addMatch = transcript.match(/can you add (\w+) to keyword/);
        if (addMatch && addMatch[1]) {
          const newKeyword = addMatch[1].toLowerCase();
          chrome.storage.local.get(["blockedStats"], (result) => {
            const stats = result.blockedStats || {};
            if (!(newKeyword in stats)) {
              stats[newKeyword] = 0;
              chrome.storage.local.set({ blockedStats: stats }, () => {
              showTemporaryBanner(`✅ "${newKeyword}" added to blocked keywords.`, "success");
            });
            } else {
                showTemporaryBanner(`⚠️ "${newKeyword}" is already in blocked keywords.`, "error");
            }
          });
          return;
        }
        
        //Deletes the keyword by saying the phrase. 
        const deleteMatch = transcript.match(/can you delete (\w+) from the keywords/);
        if (deleteMatch && deleteMatch[1]) {
          const keywordToDelete = deleteMatch[1].toLowerCase();
          chrome.storage.local.get(["blockedStats"], (result) => {
            const stats = result.blockedStats || {};
            if (keywordToDelete in stats) {
              delete stats[keywordToDelete];
              chrome.storage.local.set({ blockedStats: stats }, () => {
                showTemporaryBanner(`🗑️ "${keywordToDelete}" removed from blocked keywords.`, "success");
            });
            } else {
                showTemporaryBanner(`⚠️ "${keywordToDelete}" was not found in blocked keywords.`, "error");
            }
          });
          return;
        }
      
        //If nothing was accepted by the user, then keep try to receive an input. 
        liveMsg.textContent = "Unrecognised command. Try again.";
        recognition.start();
      };
      
  
    recognition.onerror = (e) => {
      liveMsg.textContent = "Speech recognition error. Try again.";
      console.error("Speech error:", e);
    };
    
    //This starts listening immediately. 
    recognition.start();
  
    //This disale the go back button until confirmed by the Neuphonic package.
    if (goBackButton) {
      goBackButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "close_and_open_google" });
      });
    }

    const closeInstructionsBtn = document.getElementById("closeInstructions");
    const modal = document.getElementById("instructionsModal");

    if (closeInstructionsBtn && modal) {
    closeInstructionsBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    }

  });
  