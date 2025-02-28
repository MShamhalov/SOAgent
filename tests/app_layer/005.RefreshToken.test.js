const SOLogin = require('../../src/core_layer/SOLogin.js');
const confFilePath = './tests/.env';
const sl = new SOLogin.Login(confFilePath);
const fs = require('fs');

beforeAll(async () => {});

test('Set Token To Config', async () => {
  sl.refreshToken(confFilePath);
  RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);

  expect(config.protocol).toBeTruthy();
  expect(config.instance).toBeTruthy();
  expect(config.login).toBeTruthy();
  expect(config.password).toBeTruthy();
  expect(config.token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
