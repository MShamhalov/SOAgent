const https = require('https');
const fs = require('fs');
const path = require('path');

const SOAgentCore = require('../../src/core_layer/SOAgentCore');
const confFilePath = require('../../SOAgent.conf').envFilePath;

core = new SOAgentCore.SOAgentCoreMethods();
conf = core.getConfiguration(fs, confFilePath);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


(async function () {
  const filePath = './file.pdf';

  var https = require('https');
  var fs = require('fs');

  var options = {
    'method': 'POST',
    'hostname': 'sandbox01-shamhalov.simpleone.ru',
    'path': '/v1/attachments/upload/itsm_incident/173529721097742063',
    'headers': {
      'Authorization': 'Bearer P-_HuCcAnX7pjrnZ8Sr0s9AP4QjOF7Gt'
    },
    'maxRedirects': 20
  };

  var boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  // Создаем части запроса как Buffer
  const header = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="files[]"; filename="Ololol.pdf"\r\n` +
    `Content-Type: application/pdf\r\n\r\n`,
    'utf-8'
  );

  const footer = Buffer.from(`\r\n--${boundary}--`, 'utf-8');
  const fileData = fs.readFileSync(filePath);

  // Объединяем все части в один Buffer
  const postData = Buffer.concat([header, fileData, footer]);

  req.setHeader('content-type', `multipart/form-data; boundary=${boundary}`);
  req.setHeader('Content-Length', postData.length);

  req.write(postData);
  req.end();
})();