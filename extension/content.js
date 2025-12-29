chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SHOW_ANALYSIS') {
    displayBanner(request.data);
  }
});

function displayBanner(analysis) {
  const oldBanner = document.getElementById('safetap-banner');
  if (oldBanner) {
    oldBanner.remove();
  }

  const banner = document.createElement('div');
  banner.id = 'safetap-banner';
  
  let backgroundColor = '#28a745'; // Green
  if (analysis.privacy_score < 40) {
    backgroundColor = '#dc3545'; // Red
  } else if (analysis.privacy_score < 70) {
    backgroundColor = '#ffc107'; // Yellow
  }

  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.padding = '12px';
  banner.style.backgroundColor = backgroundColor;
  banner.style.color = 'white';
  banner.style.textAlign = 'center';
  banner.style.zIndex = '9999999';
  banner.style.fontFamily = 'sans-serif';
  banner.style.fontSize = '16px';
  banner.style.fontWeight = 'bold';
  banner.style.borderBottom = '1px solid black';
  
  banner.innerHTML = `SafeTap Score: ${analysis.privacy_score}/100. ${analysis.summary}`;
  
  document.body.prepend(banner);

  setTimeout(() => {
    banner.remove();
  }, 10000);
}