const trackerUrl = 'TODO';
const user = 'TODO';

function doTrack(buttonId) {
  const event = {
    user,
    buttonId,
    documentDomain: document.domain,
    documentPath: document.location.pathname,
    documentCharset: document.charset,
    documentTitle: document.title,
    documentLang: document.documentElement.lang,
    navigatorLang: navigator.language,
    navigatorAppCodeName: navigator.appCodeName,
    navigatorAppName: navigator.appName,
    navigatorPlatform: navigator.platform,
    navigatorVendor: navigator.vendor,
    windowScreenAvailWidth: window.screen.availWidth,
    timestamp: new Date().getTime()
  }

  fetch(trackerUrl, {
    mode: 'no-cors',
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}

function attachTracker(buttonEl) {
  buttonEl.onclick = (e) => {
    doTrack(buttonEl.id);
  }
}

window.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM fully loaded and parsed');
  console.log('Attaching tracker to  buttons');
  const buttonEls = window.document.querySelectorAll("button");
  for (let i = 0; i < buttonEls.length; i++) {
    console.log(buttonEls[i]);
    attachTracker(buttonEls[i]);
  }
});
