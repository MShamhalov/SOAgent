const TableHelper = require('../../src/app_layer/tableHelper.js');
const confFilePath = './examples/.env';
const th = new TableHelper.SOTableHelper(confFilePath);

(async function () {
  const options = {
    title: 'TestTable4',
    name: '',
    parent_id: '',
    is_vcs_enabled: false,
    is_audit: true,
    record_deletion_logging: '',
    indicate_presence: '',
  };

  const result = await th.createTable(options);
  console.log(result);
})();