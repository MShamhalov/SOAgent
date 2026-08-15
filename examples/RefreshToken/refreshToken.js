/** EE:SOAgentScript */
const sl = require('#SOAgentLogin');

(async function () {
  await sl.refreshToken();
})();