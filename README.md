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
