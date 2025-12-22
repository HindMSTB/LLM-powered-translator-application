
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.selectedText) {
    chrome.runtime.sendMessage(message);
  }
});
