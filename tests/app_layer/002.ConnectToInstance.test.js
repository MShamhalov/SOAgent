const https = require('https');
const fs = require('fs');
const account = require('../../SOAgent.conf').envFilePath;

var response;
beforeAll(async () => {
  const RAWdata = fs.readFileSync(account, { encoding: 'utf8', flag: 'r' });
  const config = JSON.parse(RAWdata);
  const defAcc = config.default_account;

  const options = {
    hostname: config.accounts[defAcc].instance,
    port: 443,
    path: '/',
    method: 'GET',
  };

  response = await makeRequest(options);
});

describe('Последовательные тесты', () => {
  test('Host return status 200', async () => {
    expect(response.statusCode).toBe(200);
  });

  test('Host is instance of SimpleOne', async () => {
    const regex = /<meta\s+name="application-name"\s+content="([^"]+)"\s*\/?>/;
    const match = regex.exec(response.body);
    expect(match[1]).toBe('SimpleOne');
  });
});

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
