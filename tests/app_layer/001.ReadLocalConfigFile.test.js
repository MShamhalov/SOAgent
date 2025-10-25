const { envFilePath } = require('#conf');

test('Read Local Config File', async () => {
  const RAWdata = await Bun.file(envFilePath).text();
  const config = JSON.parse(RAWdata);

  expect(config.default_account).toBeTruthy();
  expect(config.accounts[config.default_account].protocol).toBeTruthy();
  expect(config.accounts[config.default_account].instance).toBeTruthy();
  expect(config.accounts[config.default_account].login).toBeTruthy();
  expect(config.accounts[config.default_account].password).toBeTruthy();
});
