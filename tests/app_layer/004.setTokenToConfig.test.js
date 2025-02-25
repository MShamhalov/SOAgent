const SOAgent = require('../../src/index.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);
const fs = require('fs');

beforeAll(async () => {});

test('Set Token To Config', async () => {
  const token = await sa.getUserToken();
  sa.setTokenToConfig(confFilePath, token);

  RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);

  expect(config.token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
