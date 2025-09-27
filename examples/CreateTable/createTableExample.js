const TableHelper = require('../../src/app_layer/tableHelper.js');
const account = require('../../SOAgent.conf').envFilePath;
const th = new TableHelper.SOTableHelper(account);

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