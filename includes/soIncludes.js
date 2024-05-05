export default class SimpleOneIncludes {
  constructor() {}
  /**
   * Used for getRecordUrlBySysId(objSysId)
   * @param {*} instance
   * @param {*} objSysId
   * @returns
   */
  IGetRecordUrlBySysId(instance, objSysId) {
    const scriptStr = `const recordID = '${objSysId}';
    const tables = new SimpleRecord('sys_db_table');
    tables.addEncodedQuery('name!=sys_re_table');
    tables.query();
    while (tables.next()) {
      const current = new SimpleRecord(tables.name);
      current.get(recordID);
      if (!current.sys_id) {
        continue;
      } else {
        const candidateTable=tables.name; 
        const tableName=getCurrentTable(candidateTable,recordID);
        ss.debug('https://${instance}/record/'+tableName+'/'+recordID);
        break;
      }
    }
    
    function getCurrentTable(candidateTable, recordId) {
      const SYS_DB_TABLE_IDENTITY = '155931135900000015';
      const record = new SimpleRecord(candidateTable);
      record.get(recordId);
      if (record.sys_db_table_id === SYS_DB_TABLE_IDENTITY) {
        return candidateTable;
      } 
      const tableID = record.getValue('sys_db_table_id');
      const currentTable = new SimpleRecord('sys_db_table'); 
      currentTable.get(tableID); 
      
      return currentTable.getValue('name');
    }`;

    return scriptStr;
  }

  /**
   * Used for getDocId()
   * @param {*} tableName
   * @param {*} recordId
   * @returns
   */
  IGetDocID(tableName, recordId) {
    const scriptStr = `const tableId = getTableId('${tableName}');
    const docId = ss.getDocIdByIds(tableId, ${recordId});
    ss.debug(docId);

    function getTableId(table_name) {
      const table = new SimpleRecord('sys_db_table');
      table.get('name', table_name);

      return table.getValue('sys_id');
    }`;

    return scriptStr;
  }

  ICreateAttachSurrogateRecord() {
    const scriptStr = `(async function () {
      const insFields = new Map([
            ['file_name', 'default'],
            ['mime_content_type', 'application/octet-stream'],
          ]);
          
          const surrogate = new SimpleRecord('sys_attachment');
          surrogate.initialize();
          for (const [key, value] of insFields) {
              surrogate.setValue(key, value);
          }
          const surrogateId = await surrogate.insert()
        return +surrogateId ? ss.debug(surrogateId) : ss.error(surrogate.getErrors());  
      } ());`;
      
      return JSON.stringify({"script": scriptStr});
  }
  
  ICreateAttachRecord(surrogateRecordId) {
    const scriptStr = `(async function () {
      const insFields = new Map([
            ['file_name', 'default'],
            ['mime_content_type', 'application/octet-stream'],
          ]);
          
          const surrogate = new SimpleRecord('sys_attachment');
          surrogate.initialize();
          for (const [key, value] of insFields) {
              surrogate.setValue(key, value);
          }
          const surrogateId = await surrogate.insert()
        return +surrogateId ? ss.debug(surrogateId) : ss.error(surrogate.getErrors());  
      } ());`;
      return scriptStr;
  }
}
