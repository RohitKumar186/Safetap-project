document.addEventListener('DOMContentLoaded', () => {
  // Get the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url && currentTab.url.startsWith('http')) {
      // Call our backend, just like in background.js
      fetch('http://127.0.0.1:8001/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentTab.url }),
      })
      .then(res => {
        if (!res.ok) { throw new Error('Backend error'); }
        return res.json();
      })
      .then(analysis => {
        updatePopup(analysis);
      })
      .catch(err => {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = '<h3>Error: Could not fetch analysis. Is the backend running?</h3>';
        console.error(err);
      });
    } else {
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '<h3>This page cannot be analyzed.</h3>';
    }
  });
});

function updatePopup(analysis) {
  const contentDiv = document.getElementById('content');
  let clausesHtml = '<ul>';
  analysis.risk_clauses.forEach(clause => {
    clausesHtml += `<li><strong>${clause.level}:</strong> ${clause.clause_text}</li>`;
  });
  clausesHtml += '</ul>';

  contentDiv.innerHTML = `
    <h2>Score: ${analysis.privacy_score}/100</h2>
    <p>${analysis.summary}</p>
    <h4>Detected Clauses:</h4>
    ${clausesHtml}
  `;
}