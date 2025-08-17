const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

beforeAll(async () => {
    sl.refreshToken(confFilePath);
});

describe('Последовательные тесты', () => {
    test('DownloadJSON', async () => {
        
    });
});