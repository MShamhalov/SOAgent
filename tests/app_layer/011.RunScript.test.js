const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(account);

beforeAll(async () => { });

describe('Последовательные тесты', () => {
    let recordId;
    getTableIdScript = `
        const table = new SimpleRecord('sys_db_table');
        table.get('name', 'task');
        ss.debug(table.getValue('sys_id'));
    `;

    test('Insert record to instance', async () => {
        const insertObject = {
          subject: 'Не работает беспроводная клавиатура Roxy M17',
        };
        const insertRecord = await sa.insertRecord('task', insertObject);

        recordId = sa.getValue(insertRecord, 'sys_id');
        expect(recordId).toMatch(new RegExp(/\d{18}/));
    });

    test('Run Script Action And Check DocID Calculation', async () => {
        const taskTableSysId = await sa.runScript(getTableIdScript);
        getDocIdScript = `
            const recordDocID = ss.getDocIdByIds('${taskTableSysId}', '${recordId}');
            ss.debug(recordDocID);
        `;

        const recordDocIdFromSimpleOne = await sa.runScript(getDocIdScript);
        const recordDocIdFromSOAgent = await sa.getDocId('task', recordId);
        expect(recordDocIdFromSimpleOne).toBe(recordDocIdFromSOAgent);
    });

    test('Delete Record on Instance', async () => {
        const deleteRecordString = await sa.deleteRecord('task', recordId);
        expect(['Records successfully deleted.', 'Записи успешно удалены.']).toContain(deleteRecordString.description);
    });
});