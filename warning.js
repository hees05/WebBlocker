// Optional: import Neuphonic if using a bundler
// import { createBrowserClient } from '@neuphonic/neuphonic-js/browser';

//This waits for the page to load
document.addEventListener("DOMContentLoaded", async () => {
    const goBackButton = document.getElementById("goBack");
    const reasonDiv = document.getElementById("reason");
    const liveMsg = document.getElementById("live-message");
  
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
  
      if (transcript.includes(expectedPhrase)) {
        goBackButton.disabled = false;
        liveMsg.textContent = "Phrase accepted. You may now go back.";
      } else {
        liveMsg.textContent = "Incorrect phrase. Try again.";
        recognition.start();//Keep listening since user failed to say it correctly. 
      }
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
  });
  