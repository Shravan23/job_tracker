// tests/utils.test.js

import { JSDOM } from 'jsdom';

describe('Utils Script', () => {
  let fetchEmails;
  let displayMessage;
  let emailList;
  let dom;

  beforeEach(() => {
    jest.resetModules();

    // Set up DOM
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
      <body>
        <ul id="email-list"></ul>
        <button id="auth-button"></button>
        <div id="loading-message"></div>
      </body>
      </html>
    `);

    global.window = dom.window;
    global.document = dom.window.document;

    emailList = document.getElementById('email-list');

    // Mock chrome APIs
    global.chrome = {
      identity: {
        getAuthToken: jest.fn(),
        removeCachedAuthToken: jest.fn(),
      },
      runtime: {
        lastError: null,
      },
    };

    // Mock fetch
    global.fetch = jest.fn();

    // Now require utils.js after setting up document
    ({ fetchEmails, displayMessage } = require('../src/utils'));

    fetch.mockClear();
    chrome.identity.removeCachedAuthToken.mockClear();
    chrome.identity.getAuthToken.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch emails successfully', async () => {
    const accessToken = 'fake-token';
    const messages = [{ id: '12345' }];
    const emailData = { messages };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(emailData),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          payload: {
            headers: [{ name: 'Subject', value: 'Test Email' }],
          },
        }),
      });

    await fetchEmails(accessToken);

    expect(fetch).toHaveBeenCalled();
    expect(emailList.innerHTML).toContain('Test Email');
  });

  test('should handle token expiration and retry', async () => {
    const accessToken = 'expired-token';
    const newAccessToken = 'new-token';

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    chrome.identity.removeCachedAuthToken.mockImplementation((options, callback) => {
      callback();
    });

    chrome.identity.getAuthToken.mockImplementation((options, callback) => {
      callback(newAccessToken);
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ messages: [] }),
    });

    await fetchEmails(accessToken);

    expect(chrome.identity.removeCachedAuthToken).toHaveBeenCalledWith(
      { token: accessToken },
      expect.any(Function)
    );
    expect(chrome.identity.getAuthToken).toHaveBeenCalledWith(
      { interactive: false },
      expect.any(Function)
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
