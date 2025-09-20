https = require('https');
fs = require('fs');
path = require('path');
const SOAgentCore = require('../../src/core_layer/SOAgentCore');
core = new SOAgentCore.SOAgentCoreMethods();
const confFilePath = './examples/.env';
conf = core.getConfiguration(fs, confFilePath);

(async function () {
  console.log(await core.clearCache());
})();