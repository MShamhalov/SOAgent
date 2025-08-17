const DBInterface = require('../../src/core_layer/SOAgentDBInterface.js');
const DBFilePath = ('./tmp/db/database_test.db');
const sq = new DBInterface.SOAgentDBInterface(DBFilePath, 'test_table');

const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

sl.refreshToken(confFilePath);

(async function () {
  try {
    const returnedData = await sq.dbGetData('active=1 AND (sys_id IS NULL OR sys_id = "")', 'subject, point_fpsr, record_id, name_of_the_statistical_factor, importance_of_the_statistical_factor');
    for (const currentRecord of returnedData) {
      const insertObject = {
        subject: currentRecord.subject,
        point_fpsr: currentRecord.point_fpsr,
        name_of_the_statistical_factor: currentRecord.name_of_the_statistical_factor,
        importance_of_the_statistical_factor: currentRecord.importance_of_the_statistical_factor,
      };

      const insertRecord = await sa.insertRecord('shmg_dev_open_data', insertObject);
      const sysId = sa.getValue(insertRecord, 'sys_id');
      await sq.dbUpdateField('sys_id', sysId, `record_id=${currentRecord.record_id}`);
    }
  } catch (err) {
    console.error('Script error:', err);
  } finally {
    await sq.close();
  }
})();