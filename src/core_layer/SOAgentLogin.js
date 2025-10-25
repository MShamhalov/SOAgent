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

class SOAgentLogin {
  constructor(confFilePath) {
    this.https = require('https');
    this.fs = require('fs');

    const SOAgentCore = require('./SOAgentCore.js');
    this.core = new SOAgentCore.SOAgentCoreMethods();
    this.conf = this.core.getConfiguration(this.fs, confFilePath);
    this.confFilePath = confFilePath;
  }

  async getUserToken(auth_type) {
    const answer = await this.core.getUserToken(this.https, this.conf, auth_type);
    try {
      const tokenCandidate = JSON.parse(answer).data.auth_key;
      if (!this._isTokenLooksCorrect(tokenCandidate)) return;
      return tokenCandidate;
    } catch {
      console.error('Invalid username or password!');
    }
  }

  setTokenToConfig(instanceCandidate, tokenCandidate) {
    let mode = tokenCandidate ? "fullInfoMode" : "tokenOnlyMode;"
    let token;
    let instanceTitle;
    let data = {};
    let RAWdata = '';
    try {
      RAWdata = this.fs.readFileSync(this.confFilePath, { encoding: 'utf8', flag: 'r' });
    } catch {
      console.error(`Error! File ${this.confFilePath} not found!`);
      return;
    }
    data = JSON.parse(RAWdata);

    if (mode === "fullInfoMode") {
      instanceTitle = instanceCandidate;
      token = tokenCandidate;
    } else {
      instanceTitle = data.default_account;
      token = instanceCandidate;
    }

    if (!this._isTokenLooksCorrect(token)) {
      console.log("Incorrect Token!")
      return;
    }

    data.accounts[instanceTitle].token = 'Bearer ' + token;
    this.fs.writeFileSync(this.confFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error can't write file!");
        console.error(err);
      }
    });
  }

  async refreshToken() {
    const token = await this.getUserToken();
    if (!token) return;
    this.setTokenToConfig(token);
  }

  async switchInstance(newAccount) {
    let data = {};
    let RAWdata = '';
    try {
      RAWdata = this.fs.readFileSync(this.confFilePath, { encoding: 'utf8', flag: 'r' });
    } catch {
      console.error(`Error! File ${this.confFilePath} not found!`);
      return;
    }
    data = JSON.parse(RAWdata);
    if (!data.accounts.hasOwnProperty(newAccount)) {
      console.error(`Не найден инстанс ${newAccount}`);
      return;
    }
    if (data.default_account === newAccount) {
      console.log(`Инстанс ${data.default_account} уже установлен`);
      return;
    }

    data.default_account = newAccount;

    this.fs.writeFileSync(this.confFilePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error can't write file!");
        console.error(err);
      }
    });
    console.log(`Переключено на инстанс ${newAccount}`);
  }

  async getInstanceList() {
    let RAWdata = '';

    try {
      RAWdata = this.fs.readFileSync(this.confFilePath, { encoding: 'utf8', flag: 'r' });
    } catch {
      console.error(`Error! File ${this.confFilePath} not found!`);
      return;
    }
    const data = Object.keys(JSON.parse(RAWdata).accounts);

    return data;
  }

  _isTokenLooksCorrect(token) {
    return token.length === 32;
  }
}

module.exports = { SOAgentLogin };