const fs = require('fs');
const SOLogin = require('../../src/core_layer/SOLogin.js');
const account = require('../../SOAgent.conf').envFilePath;
const sl = new SOLogin.Login(account);

beforeAll(async () => {});

test('Set Token To Config', async () => {
  const token = await sl.getUserToken();
  sl.setTokenToConfig(account, token);

  RAWdata = fs.readFileSync(account, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);
  const defAcc = config.default_account;

  expect(config.accounts[defAcc].token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
