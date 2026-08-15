/** EE:SOAgentTestScript */
const sl = require('#SOAgentLogin');
const envFilePath = require('#conf');

test('Set Token To Config', async () => {
  const token = await sl.getUserToken();
  sl.setTokenToConfig(token);

  const config = await Bun.file(envFilePath).json();
  const defAcc = config.default_account;

  expect(config.accounts[defAcc].token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
