const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(account);

const fs = require('fs');

beforeAll(async () => {
    const uploadContent = {
        "task": [
            {
                "subject": "TestTaskSubject_1"
            },
            {
                "subject": "TestTaskSubject_2"
            },
            {
                "subject": "TestTaskSubject_3"
            },
            {
                "subject": "TestTaskSubject_4"
            },
            {
                "subject": "TestTaskSubject_5"
            },
        ]
    };

    fs.writeFileSync("./uploadFile.json", JSON.stringify(uploadContent), "utf-8", "as", (error => { if (error) throw error; }));
});

describe('Последовательные тесты', () => {
    test('QuickUpload', async () => {
        const result = await sa.quickImport('./uploadFile.json');
        expect(result.filename).toEqual('uploadFile.json');
        expect(result.inserted).toEqual(5);
        expect(result.updated).toEqual(0);
        expect(result.skipped).toEqual(0);
    });

    test('Delete Records', async () => {
        const queryParams = new Map([
            ['sysparm_query', '(subjectSTARTSWITHTestTaskSubject_)^ORDERBYDESCsys_created_at'],
            ['sysparm_display_value', '0'],
            ['sysparm_exclude_reference_link', '0'],
            ['sysparm_fields', ['sys_id']],
            ['sysparm_view', ''],
            ['sysparm_limit', '5'],
            ['sysparm_page', '1'],
        ]);

        const testRecords = await sa.queryRecord('task', queryParams);
        for (const current of testRecords) {
            await sa.deleteRecord('task', current.sys_id);
        }

        const queryAfterDelete = new Map([
            ['sysparm_query', '(subjectSTARTSWITHTestTaskSubject_)'],
            ['sysparm_display_value', '0'],
            ['sysparm_exclude_reference_link', '0'],
            ['sysparm_fields', ['sys_id']],
            ['sysparm_view', ''],
            ['sysparm_limit', '20'],
            ['sysparm_page', '1'],
        ]);

        const testAfterDelete = await sa.queryRecord('task', queryAfterDelete);
        expect(testAfterDelete.length).toEqual(0);
    });

});
