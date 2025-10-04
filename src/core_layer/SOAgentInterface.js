class SimpleOneAgentInterface {
  constructor(confFilePath) {
    this.https = require('https');
    this.fs = require('fs');
    this.path = require('path');
    const SOAgentCore = require('./SOAgentCore.js');
    this.core = new SOAgentCore.SOAgentCoreMethods();
    this.confFilePath = confFilePath;
    this.conf = this.core.getConfiguration(this.fs, confFilePath);
  }

  reloadConfig() {
    this.conf = this.core.getConfiguration(this.fs, this.confFilePath);
  }

  async insertRecord(tableName, obj) {
    let stringObject = '';
    if (typeof obj === 'string') {
      stringObject = obj;
    } else if (typeof obj === 'object') {
      stringObject = JSON.stringify(obj);
    } else {
      const error = new Error('Invalid input type: expected string or object');
      console.error(error.message);
      throw error;
    }
    try {
      const RAWresult = await this.core.insertRecord(this.https, this.conf, tableName, stringObject);
      const result = JSON.parse(RAWresult);
      if (result.status !== "OK") {
        this.errorProcessing(result);
        return;
      }
      return result.data;
    } catch (error) {
      console.error("Error query record:", error.message);
      throw error;
    }
  }

  async readRecord(tableName, sysId) {
    return await this.core.readRecord(this.https, this.conf, tableName, sysId);
  }

  async queryRecord(tableName, queryParams = new Map()) {
    try {
      const RAWresult = await this.core.queryRecord(this.https, this.conf, tableName, queryParams);
      const result = JSON.parse(RAWresult);
      if (result.status !== "OK") {
        this.errorProcessing(result);
        return;
      }
      return result.data;
    } catch (error) {
      console.error("Error query record:", error.message);
      throw error;
    }
  }

  async updateRecord(tableName, sysId, obj) {
    let inputData;

    if (typeof obj === 'string') {
      inputData = obj;
    } else if (typeof obj === 'object') {
      inputData = JSON.stringify(obj);
    } else {
      const error = new Error('Invalid input type: expected string or object');
      console.error(error.message);
      throw error;
    }

    try {
      const RAWresult = await this.core.updateRecord(this.https, this.conf, tableName, sysId, inputData);
      const result = JSON.parse(RAWresult);
      if (result.status !== "OK") {
        this.errorProcessing(result);
        return;
      }
      return result.data;
    } catch (error) {
      console.error("Error updating record:", error.message);
      throw error;
    }
  }

  async deleteRecord(tableName, sysId) {
    try {
      const RAWresult = await this.core.deleteRecord(this.https, this.conf, tableName, sysId);
      const result = JSON.parse(RAWresult);
      if (result.status !== "OK") {
        this.errorProcessing(result);
        return;
      }
      return result.data;
    } catch (error) {
      console.error("Error updating record:", error.message);
      throw error;
    }
  }

  async runScript(scriptContent) {
    const content = JSON.stringify({ "script": scriptContent });
    try {
      const RAWresult = await this.core.runScript(this.https, this.conf, content);
      const response = JSON.parse(RAWresult);

      if (response.status !== "OK") {
        this.errorProcessing(response);
        return;
      }
      const result = this.removeDebugPrefix(response.data.info);

      return result;
    } catch (error) {
      console.error("Error runing script record:", error.message);
      throw error;
    }
  }

  async quickImport(filePath) {
    const fileBaseName = this.path.basename(filePath);
    const resultRAW = await this.core.quickImport(this.https, this.fs, this.conf, fileBaseName, filePath);

    return JSON.parse(resultRAW)?.data;
  }

  async attachmentsUpload(filePath) {
    const fileBaseName = this.path.basename(filePath);
    const resultRAW = await this.core.attachmentsUpload(this.https, this.fs, this.conf, fileBaseName, filePath);

    return JSON.parse(resultRAW)?.data[0];
  }

  async clearCache() {
    const resultRAW = await this.core.clearCache(this.https, this.conf);
    return JSON.parse(resultRAW);
  }

  getValue(resultString, fieldName, index = 0) {
    if (typeof resultString === 'string') {
      const data = JSON.parse(resultString).data;
      let readyData;
      if (Array.isArray(data)) {
        readyData = data[index];
      } else {
        readyData = data;
      }
      if (!readyData) {
        console.error(`Ошибка, не может быть прочитано поле ${fieldName}`);
        return;
      }
      const result =
        typeof readyData[fieldName] === 'object' ? readyData[fieldName].value : readyData[fieldName];

      return String(result);
    } else {
      return resultString[index][fieldName];
    }
  }

  saveJSONToFile(fileNameTemplate, content, table_name, beautifier = false) {
    let tab = 0;
    if (beautifier) tab = 2;
    const content2 = { [table_name]: content };
    this.fs.writeFileSync(fileNameTemplate, JSON.stringify(content2, null, tab), (err) => { if (err) throw err; }, 'as');
  }

  async getDocId(tableNameOrId, recordSysId) {
    const TableDictionary = require('./SOTableDictionary.js');
    const tableDict = new TableDictionary();
    const sysIdPattern = /\d{18}/;
    const dicTableSysId = sysIdPattern.test(tableNameOrId) ? tableNameOrId : tableDict.getTableId(tableNameOrId);
    if (dicTableSysId) {
      const tableDocId = BigInt(dicTableSysId);
      let tableHexString = tableDocId.toString(16);
      tableHexString = tableHexString.padStart(16, '0');

      const recordDocId = BigInt(recordSysId);
      let recordHexString = recordDocId.toString(16);
      recordHexString = recordHexString.padStart(16, '0');
      return tableHexString + recordHexString;
    } else {
      const soIncludes = require('../app_layer/soIncludes.js');
      const scriptStr = soIncludes.getDocId(tableName, recordSysId);
      const resultText = await this.runScript(scriptStr);
      return resultText;
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
*/

  errorProcessing(response) {
    if (response.status == '401') {
      console.error(`Request status: ${response.status}, Error message: ${response.message}`);
      return;
    }
    const combineErrorMessage = response.errors.map(error => error.message).join('; \n');
    console.error(`Request status: ${response.status}, Error message: ${combineErrorMessage}`);
    return;
  }
}

module.exports = { SimpleOneAgentInterface };
