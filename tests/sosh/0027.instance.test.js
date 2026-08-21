/** EE:SOAgentTestScript */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sa = require('#SOAgentInterface');
const path = require('path');

describe('Последовательные тесты', () => {

  test('Test 1', async () => {
    const { execSync } = require('child_process');
    let result;
    const scriptPath = path.resolve(__dirname, '../../sosh/sosh.js');
    result = execSync(`bun "${scriptPath}" i`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const expectedInstance = sa.conf.instance;

    const pattern = new RegExp(
      `Local File Path:\\s+${expectedInstance}\\s*\\n?\\s*simple\\.instance\\.uri:\\s+(?:${expectedInstance})`
    );
    expect(result).toMatch(pattern);
  }, 1000);
}); 