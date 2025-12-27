
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText.length > 0) {
    console.log('Text selected:', selectedText);
  
    chrome.runtime.sendMessage({
      action: 'textSelected',
      text: selectedText
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
      } else {
        console.log('Message sent successfully');
      }
    });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ text: selectedText });
  }
  return true; 
});

console.log('Content script loaded and ready');