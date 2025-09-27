const account = require('../../SOAgent.conf').envFilePath;
const TableHelper = require('../../src/app_layer/tableHelper.js');
const th = new TableHelper.SOTableHelper(account);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(account);

(async function () {
  await sl.refreshToken(account);

  const data = {
    active: true,
    column_type_id: this.returnColumnTypeID('Reference'),
    title: 'Reference',
    column_name: 'reference_id',
    reference_id: '155931135900000012',
    table_id: '174280644393809276',
  };

  await th.createReferenceColumn(data);
})();
