class SimpleOneAgentInterface {
  constructor(confFilePath) {
    this.https = require('https');
    this.fs = require('fs');
    this.path = require('path');
    const SOAgentCore = require('./SOAgentCore.js');
    this.core = new SOAgentCore.SOAgentCoreMethods();
    this.conf = this.core.getConfiguration(this.fs, confFilePath);
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
    return JSON.parse(await this.core.queryRecord(this.https, this.conf, tableName, queryParams));
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

  async quickImport(filePath) {
    const fileBaseName = this.path.basename(filePath);
    return this.core.quickImport(this.https, this.fs, this.conf, fileBaseName, filePath);
  }

  getValue(resultString, fieldName) {
    if (typeof resultString === 'String') {
      const data = JSON.parse(resultString).data;
      let readyData;
      if (Array.isArray(data)) {
        readyData = data[0];
      } else {
        readyData = data;
      }
      if (!readyData) {
        console.log(`Ошибка, не может быть прочитано поле ${fieldName}`);
        return;
      }
      const result =
        typeof readyData[fieldName] === 'object' ? readyData[fieldName].value : readyData[fieldName];

      return String(result);
    } else {
      return resultString.data;
    }
  }

  getStatus(resultString) {
    const status = JSON.parse(resultString).status;

    return String(status);
  }

  saveJSONToFile(fileNameTemplate, content, table_name, beautifier = false) {
    const path = './file.json';
    let tab = 0;
    if (beautifier) tab = 2;
    const content2 = { [table_name]: content };
    this.fs.writeFileSync(path, JSON.stringify(content2, null, tab), (err) => { if (err) throw err; }, 'as');
  }

  async getDocId(tableName, recordSysId) {
    const dict = require('./dictionaries.js');
    const dicTableSysId = dict.tablesAndSysIds.get(tableName);
    if (dicTableSysId) {
      console.log("Подсчитано быстро");
      const tableDocId = BigInt(dicTableSysId);
      let tableHexString = tableDocId.toString(16);
      tableHexString = tableHexString.padStart(16, '0');

      const recordDocId = BigInt(recordSysId);
      let recordHexString = recordDocId.toString(16);
      recordHexString = recordHexString.padStart(16, '0');
      
      return tableHexString + recordHexString;
    } else {
      console.log("Подсчитано медлено");
      const soIncludes = require('../app_layer/soIncludes.js');
      const scriptStr = soIncludes.getDocId(tableName, recordSysId);
      const content = JSON.stringify({ script: scriptStr });
      const resultText = await this.core.runScript(this.https, this.conf, content);
      const rawString = JSON.parse(resultText)?.data?.info;
     
      return this.removeDebugPrefix(rawString);
    }
  }

removeDebugPrefix(str) {
    return str.replace(/^(Debug|Отладка):\s*/i, '');
}
  /*

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
