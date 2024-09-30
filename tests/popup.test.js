import { setupOAuth } from '../src/oauth';

describe('OAuth Flow', () => {
  it('should successfully authenticate and return an access token', async () => {
    const token = await setupOAuth();
    expect(token).toBe('mocked_token'); // Check that the mocked token is returned
  });
});
