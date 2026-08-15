/** EE:SOAgentScript */
const envFilePath = require('#conf');
const { SOAgentCoreMethods } = require('#SOAgentCoreMethods');

const fs = require("fs");
const sc = new SOAgentCoreMethods();
const conf = sc.getConfiguration(fs, envFilePath);
const options = sc.getOptions(conf, null, null, 'sendRequest');

(async function () {
  options.path = '/v1/admin-script/run';
  console.log(await sc.sendRequest(conf, options, `{"script": "ss.debug('Hello world!');"}`));
})();