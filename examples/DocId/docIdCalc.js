const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/SOAgent.conf';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
    console.log(await sa.getDocId('itsm_incident', '175422302502016069'));
    console.log(await sa.getDocId('demand', '175422302502016069'));
})();