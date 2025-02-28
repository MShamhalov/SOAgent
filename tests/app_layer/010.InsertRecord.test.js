const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

beforeAll(async () => {
  sl.refreshToken(confFilePath);
});

test('Insert New Record To Instance', async () => {
  const insertObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M13',
  };
  const insertRecord = await sa.insertRecord('task', insertObject);
  const recordId = sa.getValue(insertRecord, 'sys_id');
  expect(recordId).toMatch(new RegExp(/\d{18}/));
});
