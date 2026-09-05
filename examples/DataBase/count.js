// Пример: подсчёт записей в таблице
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  // Общее количество записей
  const totalCount = sq.dbCount();
  console.log(`Total records in table: ${totalCount}`);

  // Количество записей по условию
  const activeCount = sq.dbCount('active', 1);
  console.log(`Active records: ${activeCount}`);
} catch (err) {
  console.error('Count error:', err.message);
} finally {
  sq.close();
}