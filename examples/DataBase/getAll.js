// Пример: получение всех записей с лимитом
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  // Первые 5 записей
  const firstPage = sq.dbGetAll('sys_id, name', 5);
  console.log('--- Page 1 ---');
  for (const row of firstPage) {
    console.log(`sys_id: ${row.sys_id}, name: ${row.name}`);
  }

  // Вторая страница по 5 записей
  const secondPage = sq.dbGetAll('sys_id, name', 5, 2);
  console.log('--- Page 2 ---');
  for (const row of secondPage) {
    console.log(`sys_id: ${row.sys_id}, name: ${row.name}`);
  }

  // Все записи без лимита
  const all = sq.dbGetAll('sys_id, name');
  console.log(`\nTotal records: ${all.length}`);
} catch (err) {
  console.error('GetAll error:', err.message);
} finally {
  sq.close();
}