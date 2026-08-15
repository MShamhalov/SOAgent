/** EE:SOAgentScript */
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const sa = require('#SOAgentInterface');

(async function () {
  console.log(await sa.clearCache());
})();