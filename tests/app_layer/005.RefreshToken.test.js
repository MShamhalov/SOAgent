const SOLogin = require('../../src/core_layer/SOLogin.js');
const confFilePath = './tests/.env';
const sl = new SOLogin.Login(confFilePath);
const fs = require('fs');

beforeAll(async () => {});

test('Set Token To Config', async () => {
  sl.refreshToken(confFilePath);
  RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);
  const defAcc = config.default_account;

  expect(config.accounts[defAcc].protocol).toBeTruthy();
  expect(config.accounts[defAcc].instance).toBeTruthy();
  expect(config.accounts[defAcc].login).toBeTruthy();
  expect(config.accounts[defAcc].password).toBeTruthy();
  expect(config.accounts[defAcc].token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
