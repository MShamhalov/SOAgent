const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const SOLogin = require('../../src/core_layer/SOLogin.js');
const account = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(account);
const sl = new SOLogin.Login(account);

(async function () {

})();