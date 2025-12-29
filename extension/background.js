chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    
    fetch('http://127.0.0.1:8001/analyze-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url }),
    })
    .then(response => {
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      return response.json();
    })
    .then(data => {
      console.log('Analysis received, sending to page:', data);
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(tabId, {
        type: 'SHOW_ANALYSIS',
        data: data
      });
    })
    .catch(error => {
      console.error('Error calling backend:', error);
    });
  }
});