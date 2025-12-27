
let lastSelectedText = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);


  if (message.action === 'textSelected') {
    lastSelectedText = message.text;
    console.log('Text stored:', lastSelectedText);
    
   
    if (sender.tab && sender.tab.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id })
        .then(() => {
          console.log('Side panel opened');
       
          setTimeout(() => {
            chrome.runtime.sendMessage({
              action: 'fillText',
              text: lastSelectedText
            });
          }, 500);
        })
        .catch(err => console.error('Error opening side panel:', err));
    }
    
    sendResponse({ success: true });
    return true;
  }

 
  if (message.action === 'getLastSelectedText') {
    sendResponse({ text: lastSelectedText });
    return true;
  }


  if (message.action === 'translate') {
    handleTranslation(message.text)
      .then(translation => {
        sendResponse({ success: true, translation });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});


async function handleTranslation(text) {
  const credentials = btoa("hind:0000");

  try {
    const response = await fetch("http://localhost:8080/api/translator/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + credentials
      },
      body: JSON.stringify({ text })
    });

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${rawText}`);
    }

    const data = JSON.parse(rawText);
    return data.translation || "Pas de traduction reçue";

  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}


chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
});

console.log('Background service worker initialized');