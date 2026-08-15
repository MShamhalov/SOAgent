/** EE:SOAgentTestScript */
const envFilePath = require('#conf');

let response;
beforeAll(async () => {
  const config = await Bun.file(envFilePath).json();
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

async function makeRequest(options) {
  const url = `https://${options.hostname}${options.path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });

  const body = await response.text();
    
  return {
    statusCode: response.status,
    body: body
  };
}
