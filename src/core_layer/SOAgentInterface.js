/**
 *                               Лицензия MIT                              
 *                                                                         
 *        Авторское право «2025» «Шамхалов Магомед Гусенович»              
 *                                                                         
 *  Данная лицензия разрешает лицам, получившим копию данного программного 
 * обеспечения  и  сопутствующей  документации  (в  дальнейшем  именуемыми 
 * «Программное   Обеспечение»),   безвозмездно  использовать  Программное 
 * Обеспечение   без   ограничений,   включая   неограниченное   право  на 
 * использование,    копирование,    изменение,     слияние,   публикацию, 
 * распространение,  сублицензирование  и/или  продажу  копий Программного 
 * Обеспечения,   а   также   лицам,   которым    предоставляется   данное 
 * Программное Обеспечение, при соблюдении следующих условий:              
 *                                                                         
 *  Указанное   выше  уведомление  об  авторском  праве  и  данные условия 
 * должны  быть  включены  во  все  копии  или   значимые   части  данного 
 * Программного Обеспечения.                                               
 *                                                                         
 *  ДАННОЕ  ПРОГРАММНОЕ  ОБЕСПЕЧЕНИЕ   ПРЕДОСТАВЛЯЕТСЯ  «КАК  ЕСТЬ»,   БЕЗ 
 * КАКИХ-ЛИБО  ГАРАНТИЙ,  ЯВНО  ВЫРАЖЕННЫХ  ИЛИ  ПОДРАЗУМЕВАЕМЫХ,  ВКЛЮЧАЯ 
 * ГАРАНТИИ   ТОВАРНОЙ   ПРИГОДНОСТИ,   СООТВЕТСТВИЯ  ПО  ЕГО  КОНКРЕТНОМУ 
 * НАЗНАЧЕНИЮ   И   ОТСУТСТВИЯ  НАРУШЕНИЙ,  НО  НЕ  ОГРАНИЧИВАЯСЬ  ИМИ. НИ 
 * В  КАКОМ  СЛУЧАЕ  АВТОРЫ  ИЛИ  ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ 
 * ПО  КАКИМ-ЛИБО  ИСКАМ,  ЗА  УЩЕРБ  ИЛИ  ПО   ИНЫМ   ТРЕБОВАНИЯМ,  В ТОМ 
 * ЧИСЛЕ,   ПРИ   ДЕЙСТВИИ   КОНТРАКТА,   ДЕЛИКТЕ   ИЛИ   ИНОЙ   СИТУАЦИИ, 
 * ВОЗНИКШИМ   ИЗ-ЗА   ИСПОЛЬЗОВАНИЯ  ПРОГРАММНОГО  ОБЕСПЕЧЕНИЯ  ИЛИ  ИНЫХ 
 * ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.                                    
 */

class SOAgentInterface {
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

  async attachmentsUpload(filePath, tableName, recordId) {
    const fileBaseName = this.path.basename(filePath);
    const resultRAW = await this.core.attachmentsUpload(this.https, this.fs, this.conf, fileBaseName, filePath, tableName, recordId);

    return JSON.parse(resultRAW).data;
  }

  async clearCache() {
    const resultRAW = await this.core.clearCache(this.https, this.conf);

    return JSON.parse(resultRAW).status;
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

  async getDocId(tableNameOrId, recordSysId = null) {
    const TableDictionary = require('./SOAgentTableDictionary.js');
    const tableDict = new TableDictionary();

    if (!recordSysId && typeof tableNameOrId === 'string' && tableNameOrId.includes('/')) {
      const parts = tableNameOrId.startsWith('/') ? tableNameOrId.slice(1).split('/') : tableNameOrId.split('/');
      if (parts.length === 2) {
        tableNameOrId = parts[0];
        recordSysId = parts[1];
      }
    }
    
    if (recordSysId) {
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
        const scriptStr = soIncludes.getDocId(tableNameOrId, recordSysId);
        const resultText = await this.runScript(scriptStr);
        return resultText;
      }
    } else {
      
      return "under constuction";
    }
  }

  removeDebugPrefix(str) {
    return str.replace(/^(Debug|Отладка):\s*/ig, '');
  }

  errorProcessing(response) {
    if (response.status == '401') {
      console.error(`Request status: ${response.status}, Error message: ${response.message}`);
      return;
    }
    const combineErrorMessage = response.errors.map(error => error.message).join('; \n');
    console.error(`Request status: ${response.status}, Error message: ${combineErrorMessage}`);
    return;
  }

  async sendRequest(options = null, body = null) {
    try {
      // Преобразуем body в строку, если это объект, который можно преобразовать при помощи JSON.stringify
      let bodyToSend = body;
      if (body && typeof body === 'object' && typeof JSON.stringify(body) !== 'undefined') {
        bodyToSend = JSON.stringify(body);
      }

      const RAWresult = await this.core.sendRequest(this.conf, options, bodyToSend);
      const result = JSON.parse(RAWresult);
      return result;
    } catch (error) {
      console.error("Error sending request:", error.message);
      throw error;
    }
  }

  async getSnippetContent(testPath, sessionConf = null) {
    let content = '';
    if (sessionConf) {
      content += `const sessionConf = ${JSON.stringify(sessionConf)}\n`;
    }
    content += await Bun.file(testPath).text();

    return content;
  }

  async getSessionConf(configPath) {
    return await Bun.file(configPath).json();
  }

  async setSessionConf(configPath, object) {
    const path = `${configPath}.conf`;
    const content = await Bun.file(path).json();
    Object.assign(content, object);
    await Bun.write(path, JSON.stringify(content, null, 2));
  }

  async getPattern(paternPath) {
    const pattern = await Bun.file(paternPath).json();

    return pattern;
  }

  async comparePattern(pattern, queryResult) {
    if (!Array.isArray(queryResult)) {
      return false;
    }

    for (const item of queryResult) {
      for (const [key, patternValue] of Object.entries(pattern)) {
        if (!(key in item)) {
          return false;
        }

        const itemValue = item[key];

        if (String(itemValue) !== String(patternValue)) {
          throw new Error(`Несоответствие значения в поле ${key} ожидаемое значение: ${String(itemValue)} фактическое значение ${String(patternValue)}`);
        }
      }
    }

    return true;
  }

  async insertRecordFromTemplate(tableName, template, reModelId = null) {
    const soIncludes = require('../app_layer/soIncludes.js');
    const scriptStr = soIncludes.insertRecordFromTemplate(tableName, JSON.stringify(template), reModelId);
    const resultText = await this.runScript(scriptStr);

    return resultText;
  }

}

module.exports = { SOAgentInterface };
