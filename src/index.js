class SimpleOneAgentInterface {
  constructor(confFilePath) {
    this.https = require('https');
    this.fs = require('fs');
    this.path = require('path');
    const SOAgentCore = require('../src/core_layer/SOAgentCore.js');
    this.core = new SOAgentCore.SOAgentCoreMethods();
    this.conf = this.core.getConfiguration(this.fs, confFilePath);
  }

  async getUserToken(auth_type) {
    const answer = await this.core.getUserToken(this.https, this.conf, auth_type);
    try {
      return JSON.parse(answer).data.auth_key;
    } catch {
      console.error('Invalid username or password!');
    }
  }

  setTokenToConfig(confFilePath, token) {
    let data = {};
    let RAWdata = '';
    try {
      RAWdata = this.fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
    } catch {
      console.error(`Error! File ${confFilePath} not found!`);
      return;
    }
    data = JSON.parse(RAWdata);
    data.token = 'Bearer ' + token;
    this.fs.writeFileSync(confFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error can't write file!");
        console.error(err);
      }
    });
  }

  async refreshToken(confFilePath, auth_type) {
    const token = await this.getUserToken();
    if (!token) return;
    this.setTokenToConfig(confFilePath, token);
  }

  async insertRecord(tableName, obj) {
    let result;
    if (typeof obj === 'string') {
      result = obj;
    } else if (typeof obj === 'object') {
      result = JSON.stringify(obj);
    } else {
      console.error('Ошибка! Не верный тип');
    }

    return await this.core.insertRecord(this.https, this.conf, tableName, result);
  }

  async readRecord(tableName, sysId) {
    return await this.core.readRecord(this.https, this.conf, tableName, sysId);
  }

  async queryRecord(tableName, queryParams) {
    return await this.core.queryRecord(this.https, this.conf, tableName, queryParams);
  }

  async updateRecord(tableName, sysId, obj) {
    let result;
    if (typeof obj === 'string') {
      result = obj;
    } else if (typeof obj === 'object') {
      result = JSON.stringify(obj);
    } else {
      console.error('Ошибка! Не верный тип');
    }

    return await this.core.updateRecord(this.https, this.conf, tableName, sysId, result);
  }

  async deleteRecord(tableName, sysId) {
    return await this.core.deleteRecord(this.https, this.conf, tableName, sysId);
  }

  async runScript(filePath) {
    const content = JSON.stringify({ script: this.fs.readFileSync(filePath, 'utf8') });

    return this.core.runScript(this.https, this.conf, content);
  }

  getValue(resultString, fieldName) {
    const RAWResult = resultString;
    const data = JSON.parse(resultString).data;
    let readyData;
    if (Array.isArray(data)) {
      readyData = data[0];
    } else {
      readyData = data;
    }
    const result =
      typeof readyData[fieldName] === 'object' ? readyData[fieldName].value : readyData[fieldName];

    return String(result);
  }

  getStatus(resultString) {
    const status = JSON.parse(resultString).status;

    return String(status);
  }

  /*
  async getDocId(tableName, sysId) {
    const scriptStr = SOAgentIncludes.IGetDocID(tableName, sysId);
    const content = JSON.stringify({ script: scriptStr });
    const resultText = await core.runScript(https, conf, content);

    return _resultFilter(resultText);
  }

  attachFileToRecord(docId, filePath) {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath);
    const mimeType = this.getMIMEtype(fileExt);
    const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

    const contentObject = {
      recordDocId: docId,
      fileName: fileName,
      fileType: mimeType,
      fileContent: fileContent,
    };

    return core.attachFileToRecord(https, conf, JSON.stringify(contentObject));
  }

  getRecordUrlBySysId(objSysId) {
    const scriptStr = SOAgentIncludes.IGetRecordUrlBySysId(conf.instance, objSysId);
    const content = JSON.stringify({ script: scriptStr });

    return core.runScript(https, conf, content);
  }

  getMIMEtype(extension) {
    const mimeTypes = new Map([
      ['.aac', 'audio/aac'],
      ['.abw', 'application/x-abiword'],
      ['.apng', 'image/apng'],
      ['.arc', 'application/x-freearc'],
      ['.avif', 'image/avif'],
      ['.avi', 'video/x-msvideo'],
      ['.azw', 'application/vnd.amazon.ebook'],
      ['.bin', 'application/octet-stream'],
      ['.bmp', 'image/bmp'],
      ['.bz', 'application/x-bzip'],
      ['.bz2', 'application/x-bzip2'],
      ['.cda', 'application/x-cdf'],
      ['.csh', 'application/x-csh'],
      ['.css', 'text/css'],
      ['.csv', 'text/csv'],
      ['.doc', 'application/msword'],
      ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      ['.eot', 'application/vnd.ms-fontobject'],
      ['.epub', 'application/epub+zip'],
      ['.gz', 'application/gzip'],
      ['.gif', 'image/gif'],
      ['.htm', 'text/html'],
      ['.html', 'text/html'],
      ['.ico', 'image/vnd.microsoft.icon'],
      ['.ics', 'text/calendar'],
      ['.jar', 'application/java-archive'],
      ['.jpeg', 'image/jpeg'],
      ['.jpg', 'image/jpeg'],
      ['.js', 'text/javascript'],
      ['.json', 'application/json'],
      ['.jsonld', 'application/ld+json'],
      ['.mid', 'audio/midi'],
      ['.midi', 'audio/midi'],
      ['.mjs', 'text/javascript'],
      ['.mp3', 'audio/mpeg'],
      ['.mp4', 'video/mp4'],
      ['.mpeg', 'video/mpeg'],
      ['.mpkg', 'application/vnd.apple.installer+xml'],
      ['.odp', 'application/vnd.oasis.opendocument.presentation'],
      ['.ods', 'application/vnd.oasis.opendocument.spreadsheet'],
      ['.odt', 'application/vnd.oasis.opendocument.text'],
      ['.oga', 'audio/ogg'],
      ['.ogv', 'video/ogg'],
      ['.ogx', 'application/ogg'],
      ['.opus', 'audio/opus'],
      ['.otf', 'font/otf'],
      ['.png', 'image/png'],
      ['.pdf', 'application/pdf'],
      ['.php', 'application/x-httpd-php'],
      ['.ppt', 'application/vnd.ms-powerpoint'],
      ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      ['.rar', 'application/vnd.rar'],
      ['.rtf', 'application/rtf'],
      ['.sh', 'application/x-sh'],
      ['.svg', 'image/svg+xml'],
      ['.tar', 'application/x-tar'],
      ['.tif', 'image/tiff'],
      ['.tiff', 'image/tiff'],
      ['.ts', 'video/mp2t'],
      ['.ttf', 'font/ttf'],
      ['.txt', 'text/plain'],
      ['.vsd', 'application/vnd.visio'],
      ['.wav', 'audio/wav'],
      ['.weba', 'audio/webm'],
      ['.webm', 'video/webm'],
      ['.webp', 'image/webp'],
      ['.woff', 'font/woff'],
      ['.woff2', 'font/woff2'],
      ['.xhtml', 'application/xhtml+xml'],
      ['.xls', 'application/vnd.ms-excel'],
      ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      ['.xml', 'application/xml'],
      ['.xul', 'application/vnd.mozilla.xul+xml'],
      ['.zip', 'application/zip'],
      ['.3gp', 'video/3gpp'],
      ['.3g2', 'video/3gpp2'],
      ['.7z', 'application/x-7z-compressed'],
    ]);
    const MIMECandidate = mimeTypes.get(extension);

    return MIMECandidate ? MIMECandidate : 'application/octet-stream';
  }
}

function _resultFilter(text) {
  const forbidden_words = ['Debug: ', 'Отладка: '];
  for (const current_word of forbidden_words) {
    if (text.includes(current_word)) {
      return text.replace(current_word, '');
    }
  }
*/
}

module.exports = { SimpleOneAgentInterface };
