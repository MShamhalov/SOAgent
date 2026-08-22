/** EE:SOAgentTestScript */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sa = require('#SOAgentInterface');

describe('Последовательные тесты', () => {

  test('Test 1', async () => {
    const { execSync } = require('child_process');
    const path = require('path');
    const projectRoot = path.resolve(__dirname, '..', '..');
    const soshPath = path.resolve(projectRoot, 'sosh', 'sosh.js');

    let result;
    result = execSync(`bun "${soshPath}" i`, {
      cwd: projectRoot,
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