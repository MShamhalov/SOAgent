/** EE:SOAgentScript */
const sa = require('#SOAgentInterface');

(async function () {
    const queryParams = new Map([
      ['sysparm_query', ''],
      ['sysparm_display_value', ''],
      ['sysparm_exclude_reference_link', ''],
      ['sysparm_fields', ['sys_id', 'name']],
      ['sysparm_view', '1'],
      ['sysparm_limit', '600'],

    ]);
    const getRecordsByQuery = await sa.queryRecord('sys_db_table', queryParams);
    sa.saveJSONToFile('file.json', getRecordsByQuery, table_name, true);
})();