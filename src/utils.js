// src/utils.js

export function fetchEmails(accessToken) {
  return fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=job+application',
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token might be expired or invalid, remove it
          return new Promise((resolve, reject) => {
            chrome.identity.removeCachedAuthToken({ token: accessToken }, function () {
              // Try to get a new token silently
              chrome.identity.getAuthToken({ interactive: false }, function (newToken) {
                if (newToken) {
                  // Retry fetching emails with the new token
                  resolve(fetchEmails(newToken));
                } else {
                  // Prompt user to sign in again
                  displayMessage('Session expired. Please sign in again.');
                  document.getElementById('auth-button').style.display = 'block';
                  reject('No new token obtained');
                }
              });
            });
          });
        } else {
          throw new Error('Failed to fetch emails');
        }
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data && data.messages) {
        parseEmails(data.messages, accessToken);
      } else {
        displayMessage('No job application emails found.');
      }
    })
    .catch((error) => {
      console.error('Error fetching emails:', error);
      displayMessage('Error fetching emails. Please try again.');
    });
}

function parseEmails(messages, accessToken) {
  const emailList = document.getElementById('email-list');
  if (emailList) {
    emailList.innerHTML = '';

    const fetchPromises = messages.map((msg) => {
      if (msg.id) {
        return fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch message details');
            }
            return response.json();
          })
          .then((messageData) => {
            const subjectHeader = messageData.payload.headers.find(
              (header) => header.name === 'Subject'
            );
            if (subjectHeader) {
              const li = document.createElement('li');
              li.textContent = subjectHeader.value;
              emailList.appendChild(li);
            }
          })
          .catch((error) => {
            console.error('Error fetching message details:', error);
          });
      } else {
        return Promise.resolve();
      }
    });

    Promise.all(fetchPromises).then(() => {
      console.log('Emails fetched and displayed.');
    });
  } else {
    console.error('Element with id "email-list" not found.');
  }
}

export function displayMessage(message, isError = false) {
  const emailList = document.getElementById('email-list');
  if (emailList) {
    emailList.innerHTML = `<li${isError ? ' class="error-message"' : ''}>${message}</li>`;
  } else {
    console.error('Element with id "email-list" not found.');
  }
}
