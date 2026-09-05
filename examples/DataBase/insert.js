// Пример: вставка записи в таблицу SQLite
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  const result = sq.dbInsertRecord({
    name: 'New Business Rule',
    description: 'Created from SOAgent example',
    active: 1
  });

  console.log('Inserted, lastInsertRowid:', result.lastInsertRowid);
  console.log('Changes:', result.changes);
} catch (err) {
  console.error('Insert error:', err.message);
} finally {
  sq.close();
}