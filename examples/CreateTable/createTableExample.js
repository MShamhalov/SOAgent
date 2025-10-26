/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentTableHelper } = require('#SOAgentTableHelper');

const th = new SOAgentTableHelper(envFilePath);

(async function () {
  const options = {
    title: 'TestTable7',
    name: 'test_table_7',
    parent_id: '',
    is_vcs_enabled: false,
    is_audit: true,
    record_deletion_logging: '',
    indicate_presence: '',
  };

  const result = await th.createTable(options);
  console.log(result);
})();