/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

(async function(){
  const insertObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M17',
  };
  const insertRecord = await sa.insertRecord('task', insertObject);
  if (!insertRecord) return;
  recordId = sa.getValue(insertRecord, 'sys_id');
  console.log(recordId);
})();
