/** EE:SOAgentScript */
const sa = require('#SOAgentInterface');

(async function () {
  const filePath = './tmp/test_incident.json';
  result = await sa.quickImport(filePath)
  console.log(result);
})();
