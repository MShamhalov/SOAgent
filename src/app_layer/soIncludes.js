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
    console.log("Searching compleate");

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


module.exports = {
  findRecordById,
  getDocId,
  getInstance
};