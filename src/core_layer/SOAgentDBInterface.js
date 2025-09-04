class SOAgentDBInterface {
  constructor(pathToSQLiteDBFile, tableName) {
    if (!pathToSQLiteDBFile) throw new Error('Database file path is required');
    if (!tableName) throw new Error('Table name is required');

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

  async dbGetData(condition, returnedFields) {
    try {
      if (!/^[\w,\s]+$/.test(returnedFields)) {
        throw new Error('Invalid field names');
      }
      
      const rows = await new Promise((resolve, reject) => {
        this.db.all(
          `SELECT ${returnedFields} FROM ${this.table} WHERE ${condition}`,
          [],
          (err, rows) => err ? reject(err) : resolve(rows)
        );
      });
      return rows;
    } catch (queryError) {
      console.error('Database query error:', queryError.message);
      throw queryError;
    }
  }

  async dbUpdateField(targetField, value, condition) {
    if (!/^\w+$/.test(targetField)) {
      throw new Error('Invalid field name');
    }
    
    await new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${this.table} SET ${targetField} = ? WHERE ${condition}`,
        [value],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
}

module.exports = { SOAgentDBInterface };