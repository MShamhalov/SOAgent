class TableDictionary {
  constructor() {
    const tableDictinaries = require('../SODictinaries/table');
    const entries = tableDictinaries.tablesAndSysIds;
    this.nameToId = new Map();
    this.idToName = new Map();

    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }

  set(key, value) {
    this.nameToId.set(key, value);
    this.idToName.set(value, key);
  }

  getTableName(tableId) {
    return this.idToName.get(tableId);
  }

  getTableId(tableName) {
    return this.nameToId.get(tableName);
  }

  hasTableId(tableId) {
    return this.idToName.has(tableId);
  }

  hasTableName(tableName) {
    return this.nameToId.has(tableName);
  }
}

module.exports = TableDictionary;
