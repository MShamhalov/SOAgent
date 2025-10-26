/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

(async function () {
  const filePath = './tmp/test_incident.json';
  result = await sa.quickImport(filePath)
  console.log(result.filename);
})();
