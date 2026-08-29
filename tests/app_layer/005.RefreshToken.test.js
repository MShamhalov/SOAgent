/** EE:SOAgentTestScript */
const sl = require('#SOAgentLogin');
const envFilePath = require('#conf');

test('Refresh Token', async () => {
  sl.refreshToken(envFilePath);
  const config = await Bun.file(envFilePath).json();
  const defAcc = config.default_account;

  expect(config.accounts[defAcc].protocol).toBeTruthy();
  expect(config.accounts[defAcc].instance).toBeTruthy();
  expect(config.accounts[defAcc].username).toBeTruthy();
  expect(config.accounts[defAcc].password).toBeTruthy();
  expect(config.accounts[defAcc].token).toMatch(/[A-Za-z0-9-_]{32}/);
});
