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

function findRecordById(objSysId) {
  const scriptStr = `
    const recordID = '${objSysId}';
    const tables = new SimpleRecord('sys_db_table');
    tables.addEncodedQuery('name!=sys_re_table');
    tables.query();
    while (tables.next()) {
      try {
        var current = new SimpleRecord(tables.name);
        current.get(recordID);
      } catch(error) {
       continue
      }
      if (current.sys_id) {
        const candidateTable = tables.name;
        const tableName = getCurrentTable(candidateTable, recordID);
        ss.debug('/record/' + tableName + '/' + recordID);
        break;
      }
    } 
    print("Searching compleate");

    function getCurrentTable(candidateTable, recordId) {
      const SYS_DB_TABLE_IDENTITY = '155931135900000015';
      const record = new SimpleRecord(candidateTable);
      record.get(recordId);
      try {
        const tableID = record.getValue('sys_db_table_id');
        const currentTable = new SimpleRecord('sys_db_table');
        currentTable.get(tableID);
        return currentTable.getValue('name');
      } catch(error) {
        return candidateTable;
      }
    }
  `;

  return scriptStr;
}

function getDocId(tableName, recordId) {
  const scriptStr = `
    const tableId = getTableId('${tableName}');
    const docId = ss.getDocIdByIds(tableId, '${recordId}');
    ss.debug(docId);

    function getTableId(table_name) {
      const table = new SimpleRecord('sys_db_table');
      table.get('name', table_name);

      return table.getValue('sys_id');
    }`;

  return scriptStr;
}

function getInstance() {
  const scriptStr = `
    ss.debug(ss.getProperty('simple.instance.uri'));
  `;

  return scriptStr;
}

function insertRecordFromTemplate(tableName, template, reModelId = null) {
  const script = `
    const templateObj = ${template};
    const reModelId = ${reModelId};
    const record = new SimpleRecord('${tableName}');
    record.initialize();
    if (reModelId) record.setReModelId('${reModelId}');
    for (const key in templateObj) {
      if (key === 'rem_attr') {
        for (const remKey in templateObj.rem_attr) {
          record.rem_attr[remKey] = templateObj.rem_attr[remKey];
        }
      } else {
        record[key] = templateObj[key];
      }
    }
    const recordId = record.insert();
    if (!+recordId) {
      ss.error(record.getErrors());
      return;
    }

    print(recordId);
  `;

  return script;
}

module.exports = {
  findRecordById,
  getDocId,
  getInstance,
  insertRecordFromTemplate,
};