/** EE:SOAgentScript */
const sa = require('#SOAgentInterface');

(async function () {
  const updateObject = {
    subject: 'Не работает беспроводная клавиатура Roxy M17',
  };
  const updateRecord = await sa.updateRecord('task', '176138705697085078', updateObject);
  recordId = sa.getValues(updateRecord, 'sys_id');
  console.log(recordId);
})();