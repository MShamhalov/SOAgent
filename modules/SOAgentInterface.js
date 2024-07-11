// import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import mainModule from './SOAgentModule.js';
import soIncludes from '../includes/soIncludes.js';

const SOAgentModule = new mainModule();
let conf;
const SOAgentIncludes = new soIncludes();

export default class SimpleOneAgentInterface {
  constructor(confFilePath) {
    conf = SOAgentModule.getConfiguration(fs, confFilePath);
  }

  async getUserToken() {
    const answer = await SOAgentModule.getUserToken(https, conf);

    return JSON.parse(answer).data.auth_key;
  }

  setTokenToConfig(confFilePath, token) {
    const RAWdata = fs.readFileSync(confFilePath, { encoding: 'utf8', flag: 'r' });
    const data = JSON.parse(RAWdata);
    data.token = 'Bearer ' + token;

    fs.writeFile(confFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) console.error(err);
    });
  }

  insertRecord(tableName, obj) {
    return SOAgentModule.insertRecord(https, conf, tableName, obj);
  }

  readRecord(tableName, sysId) {
    return SOAgentModule.readRecord(https, conf, tableName, sysId);
  }

  queryRecord(tableName, queryParams) {
    return SOAgentModule.queryRecord(https, conf, tableName, queryParams);
  }

  updateRecord(tableName, sysId, obj) {
    return SOAgentModule.updateRecord(https, conf, tableName, sysId, obj);
  }

  deleteRecord(tableName, sysId) {
    return SOAgentModule.deleteRecord(https, conf, tableName, sysId);
  }

  runScript(filePath) {
    const content = JSON.stringify({ script: fs.readFileSync(filePath, 'utf8') });

    return SOAgentModule.runScript(https, conf, content);
  }

  //---

  getValue(resultString, fieldName) {
    const data = JSON.parse(resultString).data[0];
    const result = typeof data[fieldName] === 'object' ? data[fieldName].value : data[fieldName];

    return String(result);
  }

  async getDocId(tableName, sysId) {
    const scriptStr = SOAgentIncludes.IGetDocID(tableName, sysId);
    const content = JSON.stringify({ script: scriptStr });
    const resultText = await SOAgentModule.runScript(https, conf, content);

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

    return SOAgentModule.attachFileToRecord(https, conf, JSON.stringify(contentObject));
  }

  getRecordUrlBySysId(objSysId) {
    const scriptStr = SOAgentIncludes.IGetRecordUrlBySysId(conf.instance, objSysId);
    const content = JSON.stringify({ script: scriptStr });

    return SOAgentModule.runScript(https, conf, content);
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
}
