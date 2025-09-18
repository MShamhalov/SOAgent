const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './tests/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(confFilePath);

const fs = require('fs');

beforeAll(async () => {
    sl.refreshToken(confFilePath);
    const uploadContent = {
        "task": [
            {
                "subject": "Subject_1"
            },
            {
                "subject": "Subject_2"
            },
            {
                "subject": "Subject_3"
            },
            {
                "subject": "Subject_4"
            },
            {
                "subject": "Subject_5"
            },
        ]
    };

    fs.writeFileSync("./uploadFile.json", JSON.stringify(uploadContent), "utf-8", "as", (error => { if (error) throw error; }));

});

describe('Последовательные тесты', () => {
    test('QuickUpload', async () => {
        sa.quickImport(filePath);
    });
});