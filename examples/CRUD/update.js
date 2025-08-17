const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

(async function(){
  
  const updateObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M17',
  };
  const updateRecord = await sa.updateRecord('task', '175542144008342247', updateObject);
  if (!updateRecord) return;
  recordId = sa.getValue(updateRecord, 'sys_id');
  console.log(recordId);
})();