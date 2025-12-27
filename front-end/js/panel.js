
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;


const englishTextArea = document.getElementById("englishText");
const darijaTextArea = document.getElementById("darijaText");
const startSpeechBtn = document.getElementById("startSpeechBtn");
const translateBtn = document.getElementById("translateBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const statusText = document.getElementById("statusText");


if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isListening = true;
    startSpeechBtn.classList.add('listening');
    startSpeechBtn.querySelector('.btn-text').textContent = 'Stop Speaking';
    statusText.textContent = '🎤 Listening...';
    console.log('Speech recognition started');
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      englishTextArea.value += finalTranscript;
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    statusText.textContent = `❌ Error: ${event.error}`;
    stopListening();
  };

  recognition.onend = () => {
    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error restarting recognition:', error);
        stopListening();
      }
    } else {
      stopListening();
    }
  };
} else {
  startSpeechBtn.disabled = true;
  startSpeechBtn.querySelector('.btn-text').textContent = 'Not Supported';
  console.warn('Speech recognition not supported');
}

function stopListening() {
  isListening = false;
  startSpeechBtn.classList.remove('listening');
  startSpeechBtn.querySelector('.btn-text').textContent = 'Start Speaking';
}


startSpeechBtn.addEventListener("click", () => {
  if (!recognition) {
    statusText.textContent = '❌ Speech not supported in this browser';
    return;
  }

  if (isListening) {
    recognition.stop();
    stopListening();
  } else {
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      statusText.textContent = '❌ Error starting speech recognition';
    }
  }
});


translateBtn.addEventListener("click", async () => {
  const text = englishTextArea.value.trim();

  if (!text) {
    statusText.textContent = '⚠️ Please enter some text to translate';
    return;
  }

  
  translateBtn.disabled = true;
  loadingIndicator.classList.add('active');
  statusText.textContent = 'Translating...';
  darijaTextArea.value = '';

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      text: text
    });

    if (response.success) {
      darijaTextArea.value = response.translation;
      statusText.textContent = '✓ Translation completed';
    } else {
      throw new Error(response.error || 'Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    darijaTextArea.value = '❌ Translation error occurred';
    statusText.textContent = `❌ Error: ${error.message}`;
  } finally {
    translateBtn.disabled = false;
    loadingIndicator.classList.remove('active');
    clearStatusAfterDelay();
  }
});


englishTextArea.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    translateBtn.click();
  }
});


function clearStatusAfterDelay() {
  setTimeout(() => {
    if (statusText.textContent.includes('✓') || statusText.textContent.includes('❌')) {
      statusText.textContent = '';
    }
  }, 3000);
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Panel received message:', message);

  if (message.action === 'fillText') {
    englishTextArea.value = message.text;
    statusText.textContent = '✓ Text received from selection';
    clearStatusAfterDelay();
    

    setTimeout(() => {
      translateBtn.click();
    }, 500);
  }

  sendResponse({ success: true });
  return true;
});

window.addEventListener('load', () => {
  chrome.runtime.sendMessage(
    { action: 'getLastSelectedText' },
    (response) => {
      if (response && response.text) {
        englishTextArea.value = response.text;
        statusText.textContent = '✓ Last selected text loaded';
        clearStatusAfterDelay();
      }
    }
  );
});

console.log('Panel script initialized');