class SOAgentDBInterface {
  static VALID_TABLE_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  constructor(pathToSQLiteDBFile, tableName) {
    if (!pathToSQLiteDBFile) throw new Error('Database file path is required');
    if (!tableName) throw new Error('Table name is required');
    if (!SOAgentDBInterface.VALID_TABLE_NAME.test(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }

    const sqlite3 = require('sqlite3').verbose();
    this.table = tableName;
    this.db = new sqlite3.Database(pathToSQLiteDBFile, (err) => {
      if (err) throw new Error(`Database connection error: ${err.message}`);
    });

    process.on('SIGINT', async () => {
      try {
        await this.close();
        console.log('Database connection closed');
        process.exit(0);
      } catch (closeError) {
        console.error('Error closing database:', closeError.message);
        process.exit(1);
      }
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close(err => err ? reject(err) : resolve());
    });
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

  async dbGetData(conditionField, conditionValue, returnedFields) {
    this._validateFieldList(returnedFields);
    this._validateIdentifier(conditionField);

    const rows = await new Promise((resolve, reject) => {
      this.db.all(
        `SELECT ${returnedFields} FROM ${this.table} WHERE ${conditionField} = ?`,
        [conditionValue],
        (err, rows) => err ? reject(err) : resolve(rows)
      );
    });
    return rows;
  }

  async dbUpdateField(targetField, value, conditionField, conditionValue) {
    this._validateIdentifier(targetField);
    this._validateIdentifier(conditionField);

    await new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${this.table} SET ${targetField} = ? WHERE ${conditionField} = ?`,
        [value, conditionValue],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
}

module.exports = { SOAgentDBInterface };