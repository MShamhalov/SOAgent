const fs = require('fs');
const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

(async function () {
  const args = process.argv.slice(2);
  const fileContent = fs.readFileSync(args[0], 'utf-8');

  if (args[1] === "precondition") {
    const precondition = fs.readFileSync('./examples/RunScript/precondition.js', 'utf-8');
    fileContent = precondition + fileContent;
  } 

  const taskTableSysId = await sa.runScript(fileContent);
  console.log(taskTableSysId);
})();