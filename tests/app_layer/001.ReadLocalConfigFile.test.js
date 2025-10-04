const fs = require('fs');
const account = require('../../SOAgent.conf').envFilePath;

test('Read Local Config File', async () => {
  RAWdata = fs.readFileSync(account, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);

  expect(config.default_account).toBeTruthy();
  expect(config.accounts[config.default_account].protocol).toBeTruthy();
  expect(config.accounts[config.default_account].instance).toBeTruthy();
  expect(config.accounts[config.default_account].login).toBeTruthy();
  expect(config.accounts[config.default_account].password).toBeTruthy();
});
