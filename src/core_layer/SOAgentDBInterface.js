class SOAgentDBInterface {
  constructor(pathToSQLiteDBFile, tableName) {
    const sqlite3 = require('sqlite3').verbose();
    this.table = tableName;
    this.db = new sqlite3.Database(pathToSQLiteDBFile, (err) => {
      if (err) return console.error(err.message);
    });
  }
  
  async dbGetData(query, returnedFields) {
    try {
      const rows = await new Promise((resolve, reject) => {
        this.db.all(`SELECT ${returnedFields} FROM ${this.table} WHERE ${query}`, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      const result = [];
      for (const row of rows) {
        result.push(row);
      }
      return result;
    } catch (queryError) {
      console.error('Database query error:', queryError.message);
    } finally {
      process.on('SIGINT', async () => {
        try {
          await new Promise((resolve, reject) => {
            db.close(err => err ? reject(err) : resolve());
          });
          console.log('Database connection closed');
          process.exit(0);
        } catch (closeError) {
          console.error('Error closing database:', closeError.message);
          process.exit(1);
        }
      });
    }
  }

  async dbUpdateField(targetField, value, query) {
    await new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${this.table} SET ${targetField} = ${value} WHERE ${query}`,[],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
}

module.exports = { SOAgentDBInterface };