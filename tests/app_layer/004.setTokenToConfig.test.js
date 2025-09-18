const fs = require('fs');
const SOLogin = require('../../src/core_layer/SOLogin.js');
const confFilePath = './tests/.env';
const sl = new SOLogin.Login(confFilePath);

beforeAll(async () => {});

test('Set Token To Config', async () => {
  const token = await sl.getUserToken();
  sl.setTokenToConfig(confFilePath, token);

  RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);
  const defAcc = config.default_account;

  expect(config.accounts[defAcc].token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
