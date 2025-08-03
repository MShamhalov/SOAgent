const SOLogin = require('../../src/core_layer/SOLogin.js');
const SOAgent = require('../../src/core_layer/SOAgentInterface.js');

const confFilePath = './examples/SOAgent.conf';
const sl = new SOLogin.Login(confFilePath);
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
  await sl.refreshToken(confFilePath);

  const filePath = './tmp/test_incident.json';
  sa.quickImport(filePath);
})();
