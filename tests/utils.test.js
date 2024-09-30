import { parseEmails } from '../src/utils';

describe('parseEmails', () => {
  beforeEach(() => {
    // Setup the DOM structure
    document.body.innerHTML = '<ul id="email-list"></ul>';
  });

  it('should parse emails and add them to the DOM', async () => {
    const messages = [
      {
        id: '123',
      },
    ];

    // Mock fetch call for the email message
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            payload: {
              headers: [{ name: 'Subject', value: 'Job Application' }],
            },
          }),
      })
    );

    // Call parseEmails function and wait for it to finish
    await parseEmails(messages, 'dummy_token');

    // Ensure the email list is updated
    const emailList = document.getElementById('email-list');
    console.log('Email list:', emailList.innerHTML);

    expect(emailList.children.length).toBe(1); // Check that one child was added
    expect(emailList.textContent).toBe('Job Application'); // Ensure the content is correct
  });
});
