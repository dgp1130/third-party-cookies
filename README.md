# Third-Party Cookies on DevTools

This extension is to demo a possible Chromium bug with blocking third-party
cookies on DevTools panels.

## Installation

Install the extension by downloading the source and then:
1. Open [`chrome://extensions`](chrome://extensions).
1. Check "Developer Mode" in the top-right corner.
1. Click the new "Load Unpacked" button in the top-left corner.
1. Select the directory you downloaded the source into.

## Implementation

This extension creates a new panel in Chrome DevTools which sends an
authenticated request to a URL of your choosing. Try sending a request to any
URL you have cookies for (such as `https://google.com/`) and then check in the
Network tab to see the request and verify what cookies were sent.

## Reproduction

There are two variables to tweak:
1. Whether third-party cookies are blocked by user preference (in
[chrome://settings/cookies](chrome://settings/cookies)).
  * This should determine whether or not third party cookies are blocked.
1. Whether you are loading from the DevTools panel, or from
`chrome-extension://${extensionId}/panel.html`.
  * This _should_ change nothing IMHO?

Running through the steps for each case yields interesting results:

|                    |   DevTools Panel    | `.../panel.html`  |
| ------------------ | ------------------- | ----------------- |
| 3p cookies allowed |    Cookies sent     |   Cookies sent    |
| 3p cookies blocked | **No** cookies sent | Some cookies sent |

There is basically no difference between the DevTools panel and directly using
`chrome-extension://${extensionId}/panel.html` when third-party cookies are
allowed. However, when third-party cookies are blocked, the DevTools panel and
`.../panel.html` send different cookies. This may be a bug in Chrome?

## contentSettings

One notable implementation different between using the Chrome DevTools panel
and using `.../panel.html` directly is that Chrome DevTools panels load the
`.../panel.html` page via an iframe. The top-level domain is actually
`devtools://devtools`, which you can observe by inspecting the DevTools panel,
opening the console, switching to the top frame, and then running:

```javascript
window.location.href
// devtools://devtools/...
```

This extension also enables the `contentSettings` API. When inspecting a page,
you can use `chrome.contentSettings.cookies` to inspect cookie state of various
URLs. Most notably:

```javascript
chrome.contentSettings.cookies.get({
  primaryUrl: 'https://*.google.com',
  secondaryUrl: 'chrome-extension://${extensionId}',
}, console.log);
// Prints: `{ setting: 'allow' }` (regardless of third-party cookie setting).
```

However, if you try:

```javascript
chrome.contentSettings.cookies.get({
  primaryUrl: 'https://*.google.com',
  secondaryUrl: 'devtools://devtools',
}, console.log);
// Prints `{ setting: 'allow' }` when third-party cookies are enabled.
// Prints `{ setting: 'deny' }` when third-party cookies are disabled.
```

It seems that changing the third-party cookies setting may affect Chrome
DevTools panels in a way that does not affect normal Chrome extension pages.
