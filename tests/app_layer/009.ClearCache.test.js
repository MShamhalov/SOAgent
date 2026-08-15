/** EE:SOAgentTestScript */
const sa = require('#SOAgentInterface');

describe('Clear Cache', () => {
  test('Clear Cache', async () => {
    const result = await sa.clearCache();
    expect(result).toEqual('OK');
  });

  test('Clear Client Cache', async () => {
    const options = {
      path: '/v1/cache/reset-cache',
    };
    const response = await sa.sendRequest(options);
    expect(response.data.result).toBe(true);
  });
});
