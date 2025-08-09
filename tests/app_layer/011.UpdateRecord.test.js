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

  test('Update Record On Instance', async () => {
    const updateObject = {
      subject: 'Не работает беспроводная мышь Proxy M1',
    };
    const updatedRecord = await sa.updateRecord('task', recordId, updateObject);

    const SysId = sa.getValue(updatedRecord, 'sys_id');
    expect(SysId).toMatch(new RegExp(/\d{18}/));
  });
});
