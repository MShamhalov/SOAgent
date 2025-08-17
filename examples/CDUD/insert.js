const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

(async function(){
  const insertObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M17',
  };
  const insertRecord = await sa.insertRecord('task', insertObject);
  
  recordId = sa.getValue(insertRecord, 'sys_id');
  console.log()
})();