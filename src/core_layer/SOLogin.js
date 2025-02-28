class Login {
  constructor(confFilePath) {
    this.https = require('https');
    this.fs = require('fs');

    const SOAgentCore = require('../core_layer/SOAgentCore.js');
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
}

module.exports = { Login };