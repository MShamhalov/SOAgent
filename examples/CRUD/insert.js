const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function(){
  const insertObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M17',
  };
  const insertRecord = await sa.insertRecord('task', insertObject);
  if (!insertRecord) return;
  recordId = sa.getValue(insertRecord, 'sys_id');
  console.log(recordId);
})();