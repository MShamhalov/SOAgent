const SOLogin = require('../../src/core_layer/SOLogin.js');
const confFilePath = './examples/SOAgent.conf';
const sl = new SOLogin.Login(confFilePath);

(async function () {
  await sl.refreshToken(confFilePath);
})();