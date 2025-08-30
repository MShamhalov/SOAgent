const SOAgent = require('../../src/core_layer/SOAgentInterface.js');

const confFilePath = './examples/SOAgent.conf';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
  const filePath = './tmp/test_incident.json';
  sa.quickImport(filePath);
})();
