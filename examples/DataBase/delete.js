// Пример: удаление записи из таблицы
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  const sysId = '177539865107570809';

  const result = sq.dbDeleteRecord('sys_id', sysId);
  console.log(`Deleted rows: ${result.changes}`);
} catch (err) {
  console.error('Delete error:', err.message);
} finally {
  sq.close();
}