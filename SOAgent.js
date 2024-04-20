import SOAgent from './modules/SOAgentInterface.js';
const sa = new SOAgent();

(async function () {
  console.log(await sa.getRecordUrlBySysId('170609176898389495'));
  
  })();
