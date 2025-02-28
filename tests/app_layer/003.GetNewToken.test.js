const SOLogin = require('../../src/core_layer/SOLogin.js');
const confFilePath = './tests/.env';
const sl = new SOLogin.Login(confFilePath);

beforeAll(async () => {});

test('Get New Token', async () => {
  const token = await sl.getUserToken();
  expect(token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
