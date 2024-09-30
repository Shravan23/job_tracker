import { setupOAuth } from './oauth.js';
import { fetchEmails } from './utils.js'; // Import fetchEmails from utils.js

document.addEventListener('DOMContentLoaded', () => {
  const authButton = document.getElementById('auth-button');
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    authButton.style.display = 'block';
    authButton.addEventListener('click', () => {
      setupOAuth()
        .then(token => {
          localStorage.setItem('access_token', token);
          authButton.style.display = 'none';
          fetchEmails(token); // Call fetchEmails after authentication
        })
        .catch(error => {
          console.error('Authentication failed:', error);
        });
    });
  } else {
    authButton.style.display = 'none';
    fetchEmails(accessToken); // Fetch emails if already authenticated
  }
});
