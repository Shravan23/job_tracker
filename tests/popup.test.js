// tests/popup.test.js

import { JSDOM } from 'jsdom';

jest.mock('../src/utils', () => ({
  fetchEmails: jest.fn(),
  displayMessage: jest.fn(),
}));

describe('Popup Script', () => {
  let document;
  let authButton;
  let emailList;
  let dom;

  beforeEach(() => {
    jest.resetModules();

    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
      <body>
        <button id="auth-button"></button>
        <div id="loading-message"></div>
        <ul id="email-list"></ul>
      </body>
      </html>
    `);

    document = dom.window.document;
    global.document = document;
    global.window = dom.window;

    authButton = document.getElementById('auth-button');
    emailList = document.getElementById('email-list');

    // Mock chrome.identity API
    global.chrome = {
      identity: {
        getAuthToken: jest.fn(),
        removeCachedAuthToken: jest.fn(),
      },
      runtime: {
        lastError: null,
      },
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('should fetch emails if token is available', () => {
    chrome.identity.getAuthToken.mockImplementation((options, callback) => {
      callback('fake-token');
    });

    require('../src/popup');

    // Dispatch DOMContentLoaded event
    const event = new dom.window.Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);

    expect(chrome.identity.getAuthToken).toHaveBeenCalledWith(
      { interactive: false },
      expect.any(Function)
    );
    expect(require('../src/utils').fetchEmails).toHaveBeenCalledWith('fake-token');
  });

  test('should display auth button if no token is available', () => {
    chrome.identity.getAuthToken.mockImplementation((options, callback) => {
      callback(null); // Simulate no token available
    });

    require('../src/popup');

    // Dispatch DOMContentLoaded event
    const event = new dom.window.Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);

    expect(chrome.identity.getAuthToken).toHaveBeenCalledWith(
      { interactive: false },
      expect.any(Function)
    );
    expect(authButton.style.display).toBe('block');
  });
});
