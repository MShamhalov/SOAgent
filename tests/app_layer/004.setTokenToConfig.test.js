const { envFilePath } = require('#conf');
const { SOAgentLogin } = require('#SOAgentLogin');

const sl = new SOAgentLogin(envFilePath);

test('Set Token To Config', async () => {
  const token = await sl.getUserToken();
  sl.setTokenToConfig(token);

  const RAWdata = await Bun.file(envFilePath).text();
  const config = JSON.parse(RAWdata);
  const defAcc = config.default_account;

  expect(config.accounts[defAcc].token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
