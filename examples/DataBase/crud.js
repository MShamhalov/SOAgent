// Пример: полный CRUD-цикл — создание, чтение, обновление, удаление
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  // 1. Подсчёт записей до начала
  const countBefore = sq.dbCount();
  console.log(`Records before: ${countBefore}`);

  // 2. Insert
  const insertResult = sq.dbInsertRecord({
    name: 'CRUD Example Rule',
    description: 'Created by crud.js example',
    active: 1
  });
  const newRowId = insertResult.lastInsertRowid;
  console.log(`Inserted rowid: ${newRowId}`);

  // 3. Read
  const rows = sq.dbGetData('rowid', newRowId, 'rowid, name, description, active');
  const record = rows[0];
  console.log(`Read: name="${record.name}", active=${record.active}`);

  // 4. Update
  sq.dbUpdateField('name', 'Updated CRUD Rule', 'rowid', newRowId);
  const updated = sq.dbGetData('rowid', newRowId, 'name');
  console.log(`Updated name: "${updated[0].name}"`);

  // 5. Delete
  const deleteResult = sq.dbDeleteRecord('rowid', newRowId);
  console.log(`Deleted rows: ${deleteResult.changes}`);

  // 6. Подсчёт записей после
  const countAfter = sq.dbCount();
  console.log(`Records after: ${countAfter}`);
  console.log(`Table unchanged: ${countBefore === countAfter}`);
} catch (err) {
  console.error('CRUD error:', err.message);
} finally {
  sq.close();
}