/** EE:SOAgentTestScript */
const envFilePath = require('#conf');

test('Read Local Config File', async () => {
  const config = await Bun.file(envFilePath).json();

  expect(config.default_account).toBeTruthy();
  expect(config.accounts[config.default_account].protocol).toBeTruthy();
  expect(config.accounts[config.default_account].instance).toBeTruthy();
  expect(config.accounts[config.default_account].login).toBeTruthy();
  expect(config.accounts[config.default_account].password).toBeTruthy();
});
