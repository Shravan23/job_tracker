export function parseEmails(messages, accessToken) {
  const emailList = document.getElementById('email-list');
  emailList.innerHTML = ''; // Clear the previous list

  console.log('Messages:', messages); // Debugging: Log messages

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
        .then((response) => response.json())
        .then((messageData) => {
          console.log('Message Data:', messageData); // Debugging: Log fetched message data
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
          console.error('Error fetching message details:', error); // Add error handling
        });
    } else {
      console.error('Message ID is missing in the response:', msg);
      return Promise.resolve(); // Return a resolved promise if no msg.id
    }
  });

  return Promise.all(fetchPromises).then(() => {
    console.log('Email list after processing:', emailList.innerHTML); // Debugging: Log the final email list
  });
}


// Add fetchEmails function to fetch the list of emails
export function fetchEmails(accessToken) {
  fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=job+application',
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }
  )
    .then(response => response.json())
    .then(data => {
      if (data && data.messages) {
        parseEmails(data.messages, accessToken);
      } else {
        console.error('No job application emails found.');
      }
    })
    .catch(error => {
      console.error('Error fetching emails:', error);
    });
}
