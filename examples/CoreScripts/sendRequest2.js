/** EE:SOAgentScript */
const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SOAgentInterface(account);

(async function () {
  const options = { 
    path: '/v1/cache/reset-cache',
  }
  console.log(await sa.sendRequest(options));
})();
