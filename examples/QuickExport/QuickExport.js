const SOLogin = require('../../src/core_layer/SOLogin.js');
const SOAgent = require('../../src/core_layer/SOAgentInterface.js');

const confFilePath = './examples/SOAgent.conf';
const sl = new SOLogin.Login(confFilePath);
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
    await sl.refreshToken(confFilePath);

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
    // const recordId = sa.getValue(getRecordsByQuery, 'sys_id');
    // console.log(getRecordsByQuery);
    sa.saveJSONToFile('file.json', getRecordsByQuery.data, table_name, true);
})();