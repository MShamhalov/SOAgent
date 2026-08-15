/** EE:SOAgentTestScript */
const sa = require('#SOAgentInterface');

describe('Insert Update Delete', () => {
  let recordId = '';

  test('Insert record to instance', async () => {
    const insertObject = {
      subject: 'Не работает беспроводная клавиатура Roxy M17',
      caller: '155931135900000001' // Admin user
    };
    const insertRecord = await sa.insertRecord('task', insertObject);

    recordId = sa.getValue(insertRecord, 'sys_id');
    expect(recordId).toMatch(new RegExp(/\d{18}/));
  });

  test('Update Record on Instance', async () => {
    const updateObject = {
      subject: 'Не работает беспроводная мышь Proxy M1',
    };
    const updatedRecord = await sa.updateRecord('task', recordId, updateObject);

    const SysId = sa.getValue(updatedRecord, 'sys_id');
    expect(SysId).toMatch(new RegExp(/\d{18}/));
  });

  test('Delete Record on Instance', async () => {
    const deleteRecordString = await sa.deleteRecord('task', recordId);
    expect(['Records successfully deleted.', 'Записи успешно удалены.']).toContain(deleteRecordString.description);
  });
});
