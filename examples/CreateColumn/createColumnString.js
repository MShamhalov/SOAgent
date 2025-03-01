const TableHelper = require('../../src/app_layer/tableHelper.js');
const confFilePath = './examples/.env';
const th = new TableHelper.SOTableHelper(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

(async function () {
  await sl.refreshToken(confFilePath);

  const options = {
    column_type_id: returnColumnTypeID('String'),
    title: 'TestTable4',
    column_name: 'new_column',
    table_id: '174073731994198898',

    active: true,
    read_only: false,
    mandatory: false,
    full_text_search: false,
    display_by_ref: false,
    unique: false,
  };

  const result = await th.createColumn(options);
  console.log(result);
})();

function returnColumnTypeID(columnName) {
  const columnTypes = new Map([
    ['rich_text', '42'], ['Rich Text', '42'],
    ['datetime_specific', '41'], ['Date/Time Specific', '41'],
    ['record_class', '40'], ['Record Class', '40'],
    ['translated_text', '39'], ['Translated text', '39'],
    ['color', '38'], ['Color', '38'],
    ['template', '37'], ['Template', '37'],
    ['duration', '35'], ['Duration', '35'],
    ['encrypted_password', '34'], ['Encrypted password', '34'],
    ['field_name', '33'], ['Field Name', '33'],
    ['html', '32'], ['Html', '32'],
    ['journal_input', '31'], ['Journal Input', '31'],
    ['list', '30'], ['List', '30'],
    ['script', '29'], ['Script', '29'],
    ['days_of_week', '28'], ['Days of week', '28'],
    ['password', '27'], ['Password', '27'],
    ['enum_form_split_element_type', '26'], ['Enum form_split_element_type', '26'],
    ['json', '24'], ['Json', '24'],
    ['biginteger', '23'], ['Big Integer', '23'],
    ['float', '22'], ['Float', '22'],
    ['id', '21'], ['Document ID', '21'],
    ['date', '20'], ['Date', '20'],
    ['url', '19'], ['URL', '19'],
    ['phone', '18'], ['Phone', '18'],
    ['choice', '17'], ['Choice', '17'],
    ['image', '16'], ['Image', '16'],
    ['string', '12'], ['String', '12'],
    ['text', '11'], ['Text', '11'],
    ['conditions', '10'], ['Conditions', '10'],
    ['boolean', '9'], ['True/False', '9'],
    ['reference', '8'], ['Reference', '8'],
    ['decimal', '7'], ['Decimal', '7'],
    ['percent_complete', '6'], ['Percent Complete', '6'],
    ['time', '5'], ['Time', '5'],
    ['datetime', '3'], ['Date/Time', '3'],
    ['smallinteger', '2'], ['Small Integer', '2'],
    ['integer', '1'], ['Integer', '1']
  ]);

  return columnTypes.get(columnName) || '12';
}

