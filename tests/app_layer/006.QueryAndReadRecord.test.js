const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);

beforeAll(async () => { });

describe('Последовательные тесты', () => {
  let recordId = '';

  test('Query record from instance', async () => {
    const queryParams = new Map([
      ['sysparm_query', ''],
      ['sysparm_display_value', '0'],
      ['sysparm_exclude_reference_link', '0'],
      ['sysparm_fields', ['path_name', 'sys_id']],
      ['sysparm_view', ''],
      ['sysparm_limit', '1'],
      ['sysparm_page', '1'],
    ]);

    const getRecordsByQuery = await sa.queryRecord('page', queryParams);
    recordId = sa.getValue(getRecordsByQuery, 'sys_id');
    expect(recordId).toMatch(new RegExp(/\d{18}/));
  });

  test('Read record from instance', async () => {
    const readedRecord = await sa.readRecord('page', recordId);
    const path_name = sa.getValue(readedRecord, 'path_name');
    const sys_id = sa.getValue(readedRecord, 'sys_id');

    expect(sys_id).toMatch(new RegExp(/\d{18}/));
    expect(path_name).toBeTruthy();
  });
});
