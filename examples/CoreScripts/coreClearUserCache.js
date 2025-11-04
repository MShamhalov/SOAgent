/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentCoreMethods } = require('#SOAgentCoreMethods');

const fs = require("fs");
const sc = new SOAgentCoreMethods();
const conf = sc.getConfiguration(fs, envFilePath);
const options = sc.getOptions(conf, null, null, 'sendRequest');

(async function () {
  options.path = '/v1/cache/reset-cache';
  console.log(await sc.sendRequest(options));
})();