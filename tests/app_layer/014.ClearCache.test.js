const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);

describe('Последовательные тесты', () => {
  test('Clear Cache', async () => {
    const result = await sa.clearCache();
    expect(result.status).toEqual('OK');
  });
});