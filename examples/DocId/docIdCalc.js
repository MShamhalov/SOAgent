/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

(async function () {
    console.time('localCalc');
    await sa.getDocId('itsm_incident', '175422302502016069');
    console.timeEnd('localCalc');
    
    console.time('serverCalc');
    await sa.getDocId('demand', '175422302502016069');
    console.timeEnd('serverCalc');
})();