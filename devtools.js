// Create a new panel in Chrome DevTools.
chrome.devtools.panels.create(
  '3p Cookies' /* title */,
  undefined /* iconPath */,
  '/panel.html' /* pagePath */,
  (panel) => {
    console.log('3p cookies panel loaded.', panel);
  },
);
