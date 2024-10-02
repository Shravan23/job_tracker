// src/popup.js

import { fetchEmails, displayMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const authButton = document.getElementById('auth-button');

  let accessToken = null;

  function handleAuthClick() {
    getAccessToken()
      .then((token) => {
        accessToken = token;
        fetchEmailsWithLoading(accessToken);
      })
      .catch((error) => {
        console.error('Authentication failed:', error);
        displayMessage('Authentication failed. Please try again.');
      });
  }

  function getAccessToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError || !token) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(token);
      });
    });
  }

  function fetchEmailsWithLoading(token) {
    displayLoadingMessage('Fetching emails...');
    fetchEmails(token)
      .then(() => {
        hideLoadingMessage();
      })
      .catch((error) => {
        hideLoadingMessage();
        console.error('Error fetching emails:', error);
      });
  }

  // Try to get a token silently on load
  chrome.identity.getAuthToken({ interactive: false }, function (token) {
    if (token) {
      accessToken = token;
      fetchEmailsWithLoading(accessToken);
    } else {
      // Show the auth button if not authenticated
      authButton.style.display = 'block';
    }
  });

  authButton.addEventListener('click', handleAuthClick);
});

function displayLoadingMessage(message) {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.textContent = message;
  }
}

function hideLoadingMessage() {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.textContent = '';
  }
}
