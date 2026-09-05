// Пример: постраничная выборка данных
const DBFilePath = './db/so_main.db';
const sq = require('#SOAgentDBInterface').init(DBFilePath, 'sys_business_rule');

try {
  const pageSize = 3;
  const totalRecords = sq.dbCount();
  const totalPages = Math.ceil(totalRecords / pageSize);

  console.log(`Total records: ${totalRecords}, page size: ${pageSize}, pages: ${totalPages}\n`);

  for (let page = 1; page <= totalPages; page++) {
    const rows = sq.dbGetAll('sys_id, name', pageSize, page);
    console.log(`--- Page ${page} of ${totalPages} ---`);
    for (const row of rows) {
      console.log(`  sys_id: ${row.sys_id}, name: ${row.name}`);
    }
  }
} catch (err) {
  console.error('Pagination error:', err.message);
} finally {
  sq.close();
}