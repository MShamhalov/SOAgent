// Пример: чтение записи по условию
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  const rows = sq.dbGetData('sys_id', '177539865107570809', 'sys_id, name');

  for (const row of rows) {
    console.log(`sys_id: ${row.sys_id}, name: ${row.name}`);
  }

  if (rows.length === 0) {
    console.log('Records not found');
  }
} catch (err) {
  console.error('Read error:', err.message);
} finally {
  sq.close();
}