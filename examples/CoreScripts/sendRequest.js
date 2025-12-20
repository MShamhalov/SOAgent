/** EE:SOAgentScript */

const { envFilePath } = require('#conf');
const { SOAgentCoreMethods } = require('#SOAgentCoreMethods');
const fs = require('fs');

const sc = new SOAgentCoreMethods();
const conf = sc.getConfiguration(fs, envFilePath);
const options = sc.getOptions(conf, null, null, 'sendRequest');

(async function () {
  const { headers, path, hostname, method } = options;
  path = '/v1/cache/reset-cache';
  const response = await fetch(`https://${hostname}/${path}`, {
    method: method,
    body: JSON.stringify({ message: "Hello from Bun!" }),
    headers: headers,
  });

  const body = await response.text();
  console.log(body);
})();
