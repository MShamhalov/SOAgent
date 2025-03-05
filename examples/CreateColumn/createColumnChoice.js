const confFilePath = './examples/.env';

const TableHelper = require('../../src/app_layer/tableHelper.js');
const th = new TableHelper.SOTableHelper(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

(async function () {
  await sl.refreshToken(confFilePath);

  const index = 14;
  const tableOptions = {
    name: `custom_choicetab${index}`,
    title: `Custom Choice Table${index}`
  };
  const choiceOptions = {};

  choiceOptions.attributes = {
    title: `State${index}`,
    column_name: `state${index}`,
    table_id: '174074410195124077',
    choice_type: '2',
    active: true
  };

  choiceOptions.options = [
    { name: "Option1" },
    { name: "Option2" },
    { name: "Option3" },
  ]

  await th.createChoiceColumn(choiceOptions, tableOptions);
  // await th.createChoiceColumn(choiceOptions);
})();
