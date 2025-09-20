const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);

const SOLogin = require('../../src/core_layer/SOLogin.js');
const sl = new SOLogin.Login(account);

const fs = require('fs');

beforeAll(async () => {
    sl.refreshToken(account);
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
        sa.quickImport('./uploadFile.json');
    });
});