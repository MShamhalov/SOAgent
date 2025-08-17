const SOLogin = require('../../src/core_layer/SOLogin.js');
const SOAgent = require('../../src/core_layer/SOAgentInterface.js');

const confFilePath = './examples/.env';
const sl = new SOLogin.Login(confFilePath);
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);
const fs = require('fs');

(async function () {
  await sl.refreshToken(confFilePath);

  const args = process.argv.slice(2);
  const fileContent = fs.readFileSync(args[0], 'utf-8');

  const taskTableSysId = await sa.runScript(fileContent);
  console.log(taskTableSysId);
})();