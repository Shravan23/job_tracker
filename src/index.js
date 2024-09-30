import { setupOAuth } from './oauth.js';
import { fetchEmails } from './utils.js'; // Correct import for fetchEmails

// Initialize the extension
setupOAuth().then(accessToken => {
  const emailList = document.getElementById('email-list');
  fetchEmails(accessToken, emailList); // Fetch emails only after OAuth setup
});
