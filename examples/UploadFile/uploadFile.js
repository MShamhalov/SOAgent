/** EE:SOAgentScript */
const sa = require('#SOAgentInterface');

(async function () {
  const filePath = './tmp/file.pdf';
  const res = await sa.attachmentsUpload(filePath, 'itsm_incident', '178678868505774683');
  console.log(res);
})();
 