/**
 *                               Лицензия MIT                              
 *                                                                         
 *        Авторское право «2025» «Шамхалов Магомед Гусенович»              
 *                                                                         
 *  Данная лицензия разрешает лицам, получившим копию данного программного 
 * обеспечения  и  сопутствующей  документации  (в  дальнейшем  именуемыми 
 * «Программное   Обеспечение»),   безвозмездно  использовать  Программное 
 * Обеспечение   без   ограничений,   включая   неограниченное   право  на 
 * использование,    копирование,    изменение,     слияние,   публикацию, 
 * распространение,  сублицензирование  и/или  продажу  копий Программного 
 * Обеспечения,   а   также   лицам,   которым    предоставляется   данное 
 * Программное Обеспечение, при соблюдении следующих условий:              
 *                                                                         
 *  Указанное   выше  уведомление  об  авторском  праве  и  данные условия 
 * должны  быть  включены  во  все  копии  или   значимые   части  данного 
 * Программного Обеспечения.                                               
 *                                                                         
 *  ДАННОЕ  ПРОГРАММНОЕ  ОБЕСПЕЧЕНИЕ   ПРЕДОСТАВЛЯЕТСЯ  «КАК  ЕСТЬ»,   БЕЗ 
 * КАКИХ-ЛИБО  ГАРАНТИЙ,  ЯВНО  ВЫРАЖЕННЫХ  ИЛИ  ПОДРАЗУМЕВАЕМЫХ,  ВКЛЮЧАЯ 
 * ГАРАНТИИ   ТОВАРНОЙ   ПРИГОДНОСТИ,   СООТВЕТСТВИЯ  ПО  ЕГО  КОНКРЕТНОМУ 
 * НАЗНАЧЕНИЮ   И   ОТСУТСТВИЯ  НАРУШЕНИЙ,  НО  НЕ  ОГРАНИЧИВАЯСЬ  ИМИ. НИ 
 * В  КАКОМ  СЛУЧАЕ  АВТОРЫ  ИЛИ  ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ 
 * ПО  КАКИМ-ЛИБО  ИСКАМ,  ЗА  УЩЕРБ  ИЛИ  ПО   ИНЫМ   ТРЕБОВАНИЯМ,  В ТОМ 
 * ЧИСЛЕ,   ПРИ   ДЕЙСТВИИ   КОНТРАКТА,   ДЕЛИКТЕ   ИЛИ   ИНОЙ   СИТУАЦИИ, 
 * ВОЗНИКШИМ   ИЗ-ЗА   ИСПОЛЬЗОВАНИЯ  ПРОГРАММНОГО  ОБЕСПЕЧЕНИЯ  ИЛИ  ИНЫХ 
 * ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.                                    
 */

class SOAgentTableHelper {
  constructor(confFilePath) {
    const SOAgentIndex = require('../core_layer/SOAgentInterface.js');
    this.interface = new SOAgentIndex.SOAgentInterface(confFilePath);

    // const SOAgentValidation = require('../core_layer/SOAgentValidation.js');
    // this.validator = new SOAgentValidation.Validator();
  }

  async createTable(options) {
    // if (!this.validator.checkTableAttributes(options)) {
    // console.log('Error!');
    // return;
    // }

    const insertRecord = await this.interface.insertRecord('sys_db_table', options);
    return insertRecord;
  }

  async createColumn(options) {
    // if (!this.validator.checkTableAttributes(options)) {
    // console.log('Error!');
    // return;
    // }

    const insertRecord = await this.interface.insertRecord('sys_db_column', options);
    return insertRecord;
  }

  async createColumns(columnOptions) {
    if (!Array.isArray(columnOptions)) return;

    const result = [];
    for (const columnOption of columnOptions) {
      result.push(await this.interface.insertRecord('sys_db_column', columnOption));
    }

    return result;
  }

  async createReferenceColumn(options) {
    const insertRecord = await this.interface.insertRecord('sys_db_column', options);
    return insertRecord;
  }

  async createChoiceColumn(data) {
    const { choiceAttributes, choiceOptions, tableAttributes = null } = data;
    let tableId = choiceAttributes.table_id;
    let tableNameReal;
    if (tableAttributes) {
      // Используем не стандартную таблицу
      const table = await this.createTable(tableAttributes);
      tableId = this.interface.getValue(table, 'sys_id');
      

      // Создание полей в таблице choice
      const columnsOptions = [
        {
          active: true,
          column_type_id: this.returnColumnTypeID('String'),
          column_name: 'title',
          table_id: tableId,
          title: 'Title',
        },
        {
          active: true,
          column_type_id: this.returnColumnTypeID('String'),
          title: 'Value',
          column_name: 'value',
          table_id: tableId,
        },
        {
          active: true,
          column_type_id: this.returnColumnTypeID('String'),
          title: 'Order',
          column_name: 'order',
          table_id: tableId,
        },
        {
          active: true,
          column_type_id: this.returnColumnTypeID('String'),
          title: 'Language',
          column_name: 'language',
          table_id: tableId,
        },
        {
          active: true,
          column_type_id: this.returnColumnTypeID('Reference'),
          title: 'Table',
          column_name: 'table_id',
          table_id: tableId,
        },
        {
          active: true,
          column_type_id: this.returnColumnTypeID('Reference'),
          title: 'Column',
          column_name: 'column_id',
          table_id: tableId,
        },
      ];
      await this.createColumns(columnsOptions);
      choiceAttributes.choice_table_id = tableId;
      choiceAttributes.choice_field_id = await this._getFieldIdBySysName(tableId, 'title');

      // Создание записей в Choice таблице
      for (const option of choiceOptions) {
        tableNameReal = this.interface.getValue(table, 'name');
        await this.interface.insertRecord(tableNameReal, option);
      }
    }

    choiceAttributes.column_type_id = this.returnColumnTypeID('Choice');
    const columnRecord = await this.interface.insertRecord('sys_db_column', choiceAttributes);
    const columnRecordId = this.interface.getValue(columnRecord, 'sys_id');

    if (!tableAttributes) {
      for (const option of choiceOptions) {
        option.column_id = columnRecordId;
        option.table_id = tableId;
        tableNameReal = 'sys_choice';
        await this.interface.insertRecord(tableNameReal, option);
      }
    }
  }

  returnColumnTypeID(columnName) {
    const columnTypes = new Map([
      ['rich_text', '42'],
      ['Rich Text', '42'],
      ['datetime_specific', '41'],
      ['Date/Time Specific', '41'],
      ['record_class', '40'],
      ['Record Class', '40'],
      ['translated_text', '39'],
      ['Translated text', '39'],
      ['color', '38'],
      ['Color', '38'],
      ['template', '37'],
      ['Template', '37'],
      ['duration', '35'],
      ['Duration', '35'],
      ['encrypted_password', '34'],
      ['Encrypted password', '34'],
      ['field_name', '33'],
      ['Field Name', '33'],
      ['html', '32'],
      ['Html', '32'],
      ['journal_input', '31'],
      ['Journal Input', '31'],
      ['list', '30'],
      ['List', '30'],
      ['script', '29'],
      ['Script', '29'],
      ['days_of_week', '28'],
      ['Days of week', '28'],
      ['password', '27'],
      ['Password', '27'],
      ['enum_form_split_element_type', '26'],
      ['Enum form_split_element_type', '26'],
      ['json', '24'],
      ['Json', '24'],
      ['biginteger', '23'],
      ['Big Integer', '23'],
      ['float', '22'],
      ['Float', '22'],
      ['id', '21'],
      ['Document ID', '21'],
      ['date', '20'],
      ['Date', '20'],
      ['url', '19'],
      ['URL', '19'],
      ['phone', '18'],
      ['Phone', '18'],
      ['choice', '17'],
      ['Choice', '17'],
      ['image', '16'],
      ['Image', '16'],
      ['string', '12'],
      ['String', '12'],
      ['text', '11'],
      ['Text', '11'],
      ['conditions', '10'],
      ['Conditions', '10'],
      ['boolean', '9'],
      ['True/False', '9'],
      ['reference', '8'],
      ['Reference', '8'],
      ['decimal', '7'],
      ['Decimal', '7'],
      ['percent_complete', '6'],
      ['Percent Complete', '6'],
      ['time', '5'],
      ['Time', '5'],
      ['datetime', '3'],
      ['Date/Time', '3'],
      ['smallinteger', '2'],
      ['Small Integer', '2'],
      ['integer', '1'],
      ['Integer', '1'],
    ]);

    return columnTypes.get(columnName) || '12';
  }

  _isEmptyObject(object) {
    let result = true;
    if (Object.keys(object).length !== 0) {
      result = false;
    }

    return result;
  }

  async _getFieldIdBySysName(table, columName) {
    const queryParams = new Map([
      ['sysparm_query', `table_id=${table}^column_name=${columName}`],
      ['sysparm_fields', 'sys_id'],
      ['sysparm_limit', '1'],
    ]);

    const getRecordsByQueryString = await this.interface.queryRecord('sys_db_column', queryParams);
    const getRecordsByQueryObject = JSON.parse(getRecordsByQueryString);

    if (getRecordsByQueryObject?.data?.[0]?.sys_id) {
      return getRecordsByQueryObject.data[0].sys_id;
    }
  }
}

module.exports = { SOAgentTableHelper };
