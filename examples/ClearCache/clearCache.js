/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

(async function () {
  console.log(await sa.clearCache());
})();