const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

beforeAll(async () => {
  sl.refreshToken(confFilePath);
});

describe('Последовательные тесты', () => {
  let recordId = '';

  test('Insert record to instance', async () => {
    const insertObject = {
      subject: 'Не работает беспроводная клавиатура Roxy M17',
    };
    const insertRecord = await sa.insertRecord('task', insertObject);

    recordId = sa.getValue(insertRecord, 'sys_id');
    expect(recordId).toMatch(new RegExp(/\d{18}/));
  });

  test('Delete Record on Instance', async () => {
    const deleteRecordString = await sa.deleteRecord('task', recordId);

    const result = sa.getValue(deleteRecordString, 'description');
    expect(['Records successfully deleted.', 'Записи успешно удалены.']).toContain(result);
  });
});
