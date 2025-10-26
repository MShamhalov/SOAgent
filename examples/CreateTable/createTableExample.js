/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentTableHelper } = require('#SOAgentTableHelper');
// const account = require('../../SOAgent.conf').envFilePath;
const th = new SOAgentTableHelper(envFilePath);

(async function () {
  const options = {
    title: 'TestTable5',
    name: 'test_table_5',
    parent_id: '',
    is_vcs_enabled: false,
    is_audit: true,
    record_deletion_logging: '',
    indicate_presence: '',
  };

  const result = await th.createTable(options);
  console.log(result);
})();