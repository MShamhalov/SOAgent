const SOAgent = require('../../src/index.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

beforeAll(async () => {
  sa.refreshToken(confFilePath);
});

describe('Последовательные тесты', () => {
  let recordId = '';

  test('Query record from instance', async () => {
    const queryParams = new Map([
      ['sysparm_query', ''],
      ['sysparm_display_value', '0'],
      ['sysparm_exclude_reference_link', '0'],
      ['sysparm_fields', ['number', 'sys_id', 'subject']],
      ['sysparm_view', ''],
      ['sysparm_limit', '1'],
      ['sysparm_page', '1'],
    ]);

    const getRecordsByQuery = await sa.queryRecord('task', queryParams);
    recordId = sa.getValue(getRecordsByQuery, 'sys_id');
    expect(recordId).toMatch(new RegExp(/\d{18}/));
  });

  test('Read record from instance', async () => {
    const readedRecord = await sa.readRecord('task', recordId);
    const sys_id = sa.getValue(readedRecord, 'sys_id');
    const number = sa.getValue(readedRecord, 'number');
    const subject = sa.getValue(readedRecord, 'subject');

    expect(sys_id).toMatch(new RegExp(/\d{18}/));
    expect(number).toBeTruthy();
    expect(subject).toBeTruthy();
  });
});
