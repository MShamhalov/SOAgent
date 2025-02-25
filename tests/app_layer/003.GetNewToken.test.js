const SOAgent = require('../../src/index.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

beforeAll(async () => {});

test('Get New Token', async () => {
  const token = await sa.getUserToken();
  expect(token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
