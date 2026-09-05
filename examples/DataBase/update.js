// Пример: обновление поля записи
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  const sysId = '177539865107570809';

  // Обновляем поле name у записи с указанным sys_id
  sq.dbUpdateField('name', 'Updated Business Rule', 'sys_id', sysId);
  console.log(`Record ${sysId} updated`);

  // Проверяем результат
  const rows = sq.dbGetData('sys_id', sysId, 'sys_id, name');
  for (const row of rows) {
    console.log(`sys_id: ${row.sys_id}, name: ${row.name}`);
  }
} catch (err) {
  console.error('Update error:', err.message);
} finally {
  sq.close();
}