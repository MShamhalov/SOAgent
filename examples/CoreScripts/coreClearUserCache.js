/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentCoreMethods } = require('#SOAgentCoreMethods');

const fs = require("fs");
const https = require("https");
const sc = new SOAgentCoreMethods();
const conf = sc.getConfiguration(fs, envFilePath);
const options = sc.getOptions(conf, null, null, 'postRequest');

(async function () {
  options.path = '/v1/cache/reset-cache';
  console.log(await sc.postRequest(https, options));
})();