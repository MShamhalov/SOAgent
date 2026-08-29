/** EE:SOAgentTestScript */
const envFilePath = require('#conf');

test('Read Local Config File', async () => {
  const config = await Bun.file(envFilePath).json();

  expect(config).toHaveProperty('default_account');
  expect(config).toHaveProperty('accounts');
  expect(config.accounts).toHaveProperty(config.default_account);

  const account = config.accounts[config.default_account];
  expect(account).toHaveProperty('protocol');
  expect(account).toHaveProperty('instance');
  expect(account).toHaveProperty('username');
  expect(account).toHaveProperty('password');
});
