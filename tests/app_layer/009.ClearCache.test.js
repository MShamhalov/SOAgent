const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

describe('Clear Cache', () => {
  test('Clear Cache', async () => {
    const result = await sa.clearCache();
    expect(result).toEqual('OK');
  });
});
