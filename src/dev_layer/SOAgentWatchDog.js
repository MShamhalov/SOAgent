/** EE:SOAgentScript */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const sa = require('#SOAgentInterface');

import { $ } from 'bun';

const createdBy = process.argv[2] || '175189118507032327';
const intervalMs = parseInt(process.argv[3], 10) || 10000;

while (true) {
  await (async function () {
    const currentDataTime = getCurrentDateTime(0);
    const minusNMinutsDataTime = getCurrentDateTime(1);
    console.clear();
    console.log(`Created By: ${createdBy}, Interval: ${intervalMs}ms\n\n`);
    console.log(`${getCurrentDateTimeLocal(0)} - Current Time `);
    
    // Debug Message
    const debugRecords = {
      query: `(level=debug^sys_created_by=${createdBy}^sys_created_atBETWEEN${minusNMinutsDataTime}@${currentDataTime})`,
      limit: 5,
      fiels: ['message', 'sys_created_at'],
    };
    console.log(clearData(await getData('sys_log', debugRecords, 'Debug messages')));
    
    // Exception Message
    const exceptionRecords = {
      query: `(level=error^sys_created_by=${createdBy}^sys_created_atBETWEEN${minusNMinutsDataTime}@${currentDataTime})`,
      // query: `(level=error)`,
      limit: 5,
      fiels: ['message', 'sys_created_at'],
    };
    console.log(clearData(await getData('sys_log_exception', exceptionRecords, 'Exception messages')));

    // Error Message
    const errorRecords = {
      query: `(level=error^sys_created_by=${createdBy}^sys_created_atBETWEEN${minusNMinutsDataTime}@${currentDataTime})`,
      limit: 5,
      fiels: ['message', 'sys_created_at'],
    };
    console.log(clearData(await getData('sys_log', errorRecords, 'Error messages')));

    
  })();

  await new Promise(resolve => setTimeout(resolve, intervalMs));
}

async function getData(tableName, queryRecords, title) {
  const result = {};
  const res = await sa.queryRecord(tableName, queryRecords);
  result.title = title;
  result.data = res;

  return result;
}

function clearData(obj) {
  const currentDataTime = getCurrentDateTime(0);
  let result = obj.title + "\n";
  if (!obj.data.length) return `NO ${obj.title} on last minute\n`;
  for (const current of obj.data) {
    result += `${simplificationDataTime(current.sys_created_at)} - ${current['message']} \n`;
  }

  return result;
}

function getCurrentDateTime(minus) {
  const baseDate = new Date();

  if (minus) {
    baseDate.setMinutes(baseDate.getMinutes() - minus);
  }
  baseDate.setHours(baseDate.getHours() - 3);
  const year = baseDate.getFullYear();
  const month = (baseDate.getMonth() + 1).toString().padStart(2, 0);
  const day = baseDate.getDate().toString().padStart(2, 0);
  const hour = baseDate.getHours().toString().padStart(2, 0);
  const minute = baseDate.getMinutes().toString().padStart(2, 0);
  const second = baseDate.getSeconds().toString().padStart(2, 0);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function getCurrentDateTimeLocal(minus) {
  const baseDate = new Date();

  if (minus) {
    baseDate.setMinutes(baseDate.getMinutes() - minus);
  }
  const year = baseDate.getFullYear();
  const month = (baseDate.getMonth() + 1).toString().padStart(2, 0);
  const day = baseDate.getDate().toString().padStart(2, 0);
  const hour = baseDate.getHours().toString().padStart(2, 0);
  const minute = baseDate.getMinutes().toString().padStart(2, 0);
  const second = baseDate.getSeconds().toString().padStart(2, 0);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function simplificationDataTime(simpleDateTime) {
  const logDateTime = new Date(simpleDateTime);
  logDateTime.setHours(logDateTime.getHours() + 3);

  const year = logDateTime.getFullYear();
  const month = (logDateTime.getMonth() + 1).toString().padStart(2, 0);
  const day = logDateTime.getDate().toString().padStart(2, 0);
  const hour = logDateTime.getHours().toString().padStart(2, 0);
  const minute = logDateTime.getMinutes().toString().padStart(2, 0);
  const second = logDateTime.getSeconds().toString().padStart(2, 0);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
