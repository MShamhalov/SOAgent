const { Database } = require('bun:sqlite');

class SOAgentDBInterface {
  static VALID_TABLE_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  constructor() {
    this.table = null;
    this.db = null;
  }

  init(pathToSQLiteDBFile, tableName) {
    if (!pathToSQLiteDBFile) throw new Error('Database file path is required');
    if (!tableName) throw new Error('Table name is required');
    if (!SOAgentDBInterface.VALID_TABLE_NAME.test(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }

    const fs = require('fs');
    if (!fs.existsSync(pathToSQLiteDBFile)) {
      throw new Error(`Database file not found: ${pathToSQLiteDBFile}`);
    }

    this.table = tableName;
    this.db = new Database(pathToSQLiteDBFile);

    process.on('SIGINT', () => {
      try {
        this.close();
        console.log('Database connection closed');
        process.exit(0);
      } catch (closeError) {
        console.error('Error closing database:', closeError.message);
        process.exit(1);
      }
    });

    return this;
  }

  close() {
    this.db.close();
  }

  _validateIdentifier(name) {
    if (!/^[\w]+$/.test(name)) {
      throw new Error(`Invalid identifier: ${name}`);
    }
    return name;
  }

  _validateFieldList(fields) {
    if (!/^[\w,\s]+$/.test(fields)) {
      throw new Error('Invalid field names');
    }
    return fields;
  }

  _quoteIdentifier(name) {
    return `"${name}"`;
  }

  dbGetData(conditionField, conditionValue, returnedFields, limit = null, page = 1) {
    this._validateFieldList(returnedFields);
    this._validateIdentifier(conditionField);

    const quotedFields = returnedFields.split(',').map(f => this._quoteIdentifier(f.trim())).join(', ');
    let sql = `SELECT ${quotedFields} FROM "${this.table}" WHERE "${conditionField}" = ?`;
    const params = [conditionValue];

    if (limit) {
      const offset = (page - 1) * limit;
      sql += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    return this.db.prepare(sql).all(...params);
  }

  dbGetAll(returnedFields = '*', limit = null, page = 1) {
    this._validateFieldList(returnedFields);

    const quotedFields = returnedFields === '*'
      ? '*'
      : returnedFields.split(',').map(f => this._quoteIdentifier(f.trim())).join(', ');
    let sql = `SELECT ${quotedFields} FROM "${this.table}"`;
    if (limit) {
      const offset = (page - 1) * limit;
      sql += ` LIMIT ? OFFSET ?`;
      return this.db.prepare(sql).all(limit, offset);
    }
    return this.db.prepare(sql).all();
  }

  dbInsertRecord(obj) {
    if (!obj || typeof obj !== 'object') {
      throw new Error('Insert object is required');
    }

    const keys = Object.keys(obj);
    for (const key of keys) {
      this._validateIdentifier(key);
    }

    const columns = keys.map(k => this._quoteIdentifier(k)).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(k => obj[k]);

    const stmt = this.db.prepare(
      `INSERT INTO "${this.table}" (${columns}) VALUES (${placeholders})`
    );
    return stmt.run(...values);
  }

  dbDeleteRecord(conditionField, conditionValue) {
    this._validateIdentifier(conditionField);

    const stmt = this.db.prepare(
      `DELETE FROM "${this.table}" WHERE "${conditionField}" = ?`
    );
    return stmt.run(conditionValue);
  }

  dbCount(conditionField = null, conditionValue = null) {
    let stmt;
    if (conditionField) {
      this._validateIdentifier(conditionField);
      stmt = this.db.prepare(
        `SELECT COUNT(*) AS count FROM "${this.table}" WHERE "${conditionField}" = ?`
      );
      return stmt.get(conditionValue).count;
    }
    stmt = this.db.prepare(`SELECT COUNT(*) AS count FROM "${this.table}"`);
    return stmt.get().count;
  }

  dbUpdateField(targetField, value, conditionField, conditionValue) {
    this._validateIdentifier(targetField);
    this._validateIdentifier(conditionField);

    const stmt = this.db.prepare(
      `UPDATE "${this.table}" SET "${targetField}" = ? WHERE "${conditionField}" = ?`
    );
    stmt.run(value, conditionValue);
  }
}

module.exports = new SOAgentDBInterface();