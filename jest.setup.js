global.chrome = {
    runtime: {
      id: 'mocked-chrome-runtime-id',
    },
    identity: {
      launchWebAuthFlow: jest.fn((options, callback) => {
        // Simulate a successful OAuth redirect URL
        callback('https://mocked-redirect-url/#access_token=mocked_token');
      }),
      onSignInChanged: {
        addListener: jest.fn(),
      },
    },
  };
  