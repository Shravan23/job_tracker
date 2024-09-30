const clientId = '712541534647-2bmbh1c6js05tsttkq67fordllrqjc0d.apps.googleusercontent.com';  // Replace with your Client ID
const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;  // Use the correct redirect URI

// Define oauthUrl correctly before using it
const oauthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=https://www.googleapis.com/auth/gmail.readonly`;

document.getElementById('auth-button').addEventListener('click', function() {
  chrome.identity.launchWebAuthFlow({
    url: oauthUrl,  // Ensure oauthUrl is properly defined here
    interactive: true
  }, function(redirectUrl) {
    if (chrome.runtime.lastError || !redirectUrl) {
      console.error(chrome.runtime.lastError);
      return;
    }

    const accessToken = new URL(redirectUrl).hash.match(/access_token=([^&]*)/)[1];

    fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.messages && data.messages.length > 0) {
        let emailList = document.getElementById('email-list');
        emailList.innerHTML = '';  // Clear the previous list

        data.messages.forEach(msg => {
          if (msg.id) {
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`, {
              headers: {
                'Authorization': 'Bearer ' + accessToken
              }
            })
            .then(response => response.json())
            .then(messageData => {
              let subjectHeader = messageData.payload.headers.find(header => header.name === 'Subject');
              if (subjectHeader) {
                let li = document.createElement('li');
                li.textContent = subjectHeader.value;
                emailList.appendChild(li);
              }
            });
          } else {
            console.error("Message ID is missing in the response:", msg);
          }
        });
      } else {
        console.error("No messages found or invalid data format:", data);
      }
    })
    .catch(error => {
      console.error("Error fetching messages:", error);
    });
  });
});
