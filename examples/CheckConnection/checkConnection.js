const https = require('https');
const fs = require('fs');
const confFilePath = './examples/.env';

const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

var response;

(async function () {
  const RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);

  const options = {
    hostname: config.instance,
    port: 443,
    path: '/',
    method: 'GET',
  };

  response = await makeRequest(options);
  const regex = /<meta\s+name="application-name"\s+content="([^"]+)"\s*\/?>/;
  const match = regex.exec(response.body);
  // console.log(response.statusCode);
  // console.log(match[1]);

  //-----------------------------------------------------

  const queryParams = new Map([
    ['sysparm_query', ''],
    ['sysparm_display_value', '0'],
    ['sysparm_exclude_reference_link', '0'],
    ['sysparm_fields', ['path_name', 'sys_id']],
    ['sysparm_view', ''],
    ['sysparm_limit', '1'],
    ['sysparm_page', '1'],
  ]);

  const getRecordsByQuery = await sa.queryRecord('page', queryParams);
  if (!getRecordsByQuery) return;
  const recordId = sa.getValue(getRecordsByQuery, 'sys_id');
  console.log(recordId);

})();

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let result = '';
      response.on('data', (chunk) => (result += chunk));
      response.on('end', () => resolve({ statusCode: response.statusCode, body: result }));
      response.on('error', reject);
    });

    request.on('error', reject);
    request.end();
  });
}