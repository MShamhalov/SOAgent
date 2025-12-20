const SOAgent = require('../../src/core_layer/SOAgentInterface.js');

const confFilePath = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
  const filePath = './file.pdf';
  const res = await sa.attachmentsUpload(filePath, 'task', '175959346800487422');
  console.log(res);
})();
 