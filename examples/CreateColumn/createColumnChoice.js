const TableHelper = require('../../src/app_layer/tableHelper.js');
const confFilePath = './examples/.env';
const th = new TableHelper.SOTableHelper(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

const SOInterface = require('../../src/core_layer/SOAgentInterface.js');
const si = new SOInterface.SimpleOneAgentInterface(confFilePath);

(async function () {
  await sl.refreshToken(confFilePath);

  const tableOptions = {
    title: 'Choice Option9',
    name: 'choice_option_9',
    parent_id: '',
    is_vcs_enabled: false,
    is_audit: true,
    record_deletion_logging: '',
    indicate_presence: '',
  };
  const table = await th.createTable(tableOptions);
  const tableId = si.getValue(table, 'sys_id');

  const stringColumnOptions = {
    column_type_id: th.returnColumnTypeID('String'),
    title: 'Name',
    column_name: 'name',
    table_id: tableId,

    active: true,
    read_only: false,
    mandatory: false,
    full_text_search: false,
    display_by_ref: false,
    unique: false,
  };

  const result = await th.createColumn(stringColumnOptions);
  const column_id = si.getValue(result, 'sys_id');

  const choiceOptions = {
    title: 'Test Column 9',
    column_name: 'new_column9',
    table_id: '174074410195124077',
    choice_type: '1',
    choice_table_id: tableId,
    choice_field_id: column_id,

    active: true,
    read_only: false,
    mandatory: false,
    full_text_search: false,
    display_by_ref: false,
    unique: false,

  };

  const result2 = await th.createChoiceColumn(choiceOptions, tableOptions);

})();

