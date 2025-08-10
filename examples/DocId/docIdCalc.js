const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
    console.time('localCalc');
    await sa.getDocId('itsm_incident', '175422302502016069');
    console.timeEnd('localCalc');
    
    console.time('serverCalc');
    await sa.getDocId('demand', '175422302502016069');
    console.timeEnd('serverCalc');
})();