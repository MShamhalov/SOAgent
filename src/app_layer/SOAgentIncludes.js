function _escapeForScript(value) {
  if (typeof value !== 'string') value = String(value);
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

function findRecordById(objSysId) {
  const safeId = _escapeForScript(objSysId);
  const scriptStr = `
    const recordID = '${safeId}';
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
        print('/record/' + tableName + '/' + recordID);
        break;
      }
    }

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
  const safeTableName = _escapeForScript(tableName);
  const safeRecordId = _escapeForScript(recordId);
  const scriptStr = `
    const tableId = getTableId('${safeTableName}');
    const docId = ss.getDocIdByIds(tableId, '${safeRecordId}');
    print(docId);

    function getTableId(table_name) {
      const table = new SimpleRecord('sys_db_table');
      table.get('name', table_name);

      return table.getValue('sys_id');
    }`;

  return scriptStr;
}

function getInstance() {
  const scriptStr = `
    print(ss.getProperty('simple.instance.uri'));
  `;

  return scriptStr;
}

function insertRecordFromTemplate(tableName, template, reModelId = null) {
  const safeTableName = _escapeForScript(tableName);
  const script = `
    const templateObj = ${template};
    const reModelId = ${reModelId};
    const record = new SimpleRecord('${safeTableName}');
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