const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);

describe('Последовательные тесты', () => {
    test('DownloadJSON', async () => {
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
