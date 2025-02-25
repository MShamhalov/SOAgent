const confFilePath = './tests/.env';
const fs = require('fs');

beforeAll(async () => {});

test('Read Local Config File', async () => {
  RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);

  expect(config.protocol).toBeTruthy();
  expect(config.instance).toBeTruthy();
  expect(config.login).toBeTruthy();
  expect(config.password).toBeTruthy();
});
