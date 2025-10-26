/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

(async function () {
    const queryParams = new Map([
      ['sysparm_query', ''],
      ['sysparm_display_value', ''],
      ['sysparm_exclude_reference_link', ''],
      ['sysparm_fields', ['sys_id', 'name']],
      ['sysparm_view', '1'],
      ['sysparm_limit', '600'],

    ]);
    const table_name = 'sys_db_table';
    const getRecordsByQuery = await sa.queryRecord(table_name, queryParams);

    sa.saveJSONToFile('file.json', getRecordsByQuery, table_name, true);
})();