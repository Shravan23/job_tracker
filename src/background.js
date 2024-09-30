chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  if (signedIn) {
    console.log(`User ${account.email} signed in.`);
  } else {
    console.log(`User ${account.email} signed out.`);
  }
});
