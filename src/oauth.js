const clientId = process.env.CLIENT_ID; // Ensure this is injected correctly by Webpack
const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;

const oauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/gmail.readonly`;

export function setupOAuth() {
  return new Promise((resolve, reject) => { // Wrap in a promise to handle OAuth flow
    chrome.identity.launchWebAuthFlow(
      {
        url: oauthUrl,
        interactive: true,
      },
      function (redirectUrl) {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
          return;
        }

        const accessToken = new URL(redirectUrl).hash.match(
          /access_token=([^&]*)/
        )[1];
        resolve(accessToken); // Resolve the access token
      },
    );
  });
}
