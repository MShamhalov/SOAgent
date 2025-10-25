const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

describe('Quick Export', () => {
  test('Quick Export', async () => {
    const queryParams = new Map([
      ['sysparm_query', ''],
      ['sysparm_display_value', ''],
      ['sysparm_exclude_reference_link', ''],
      ['sysparm_fields', ['sys_id', 'name']],
      ['sysparm_view', '1'],
      ['sysparm_limit', '5'],

    ]);
    const table_name = 'sys_db_table';
    const getRecordsByQuery = await sa.queryRecord(table_name, queryParams);

    expect(getRecordsByQuery.length).toEqual(5);
    expect(getRecordsByQuery[0]).toHaveProperty('sys_id');
    expect(getRecordsByQuery[0]).toHaveProperty('name');
  });
});
