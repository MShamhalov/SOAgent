/** EE:SOAgentScript */
const th = require('#SOAgentTableHelper');

(async function () {
  const options = {
    title: 'TestTable7',
    name: 'test_table_7',
    parent_id: '',
    is_vcs_enabled: false,
    is_audit: true,
    record_deletion_logging: false,
    indicate_presence: false,
  };

  const result = await th.createTable(options);
  console.log(result);
})();