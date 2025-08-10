const DBInterface = require('../../src/core_layer/SOAgentDBInterface.js');
const DBFilePath = ('./db/Chinook.db');
const sq = new DBInterface.SOAgentDBInterface(DBFilePath, 'test_table');

const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

sl.refreshToken(confFilePath);

(async function () {
  try {
    const returnedData = await sq.dbGetData('active=1 AND sys_id IS NULL', 'subject, point_fpsr, record_id');
    for (const currentRecord of returnedData) {
      const insertObject = {
        subject: currentRecord.subject,
        point_fpsr: currentRecord.point_fpsr,
      };

      const insertRecord = await sa.insertRecord('shmg_dev_open_data', insertObject);
      const recordId = sa.getValue(insertRecord, 'sys_id');
      await sq.dbUpdateField('sys_id', recordId, `record_id=${currentRecord.record_id}`);
    }
  } catch (err) {
    console.error('Script error:', err);
  } finally {
    await sq.close();
  }
})();