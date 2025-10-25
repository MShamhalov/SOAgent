/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

(async function() {
  const updateObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M17',
  };
  const updateRecord = await sa.updateRecord('task', '176138705697085078', updateObject);
  if (!updateRecord) return;
  recordId = sa.getValue(updateRecord, 'sys_id');
  console.log(recordId);
})();