class SOAgentCoreMethods {
  constructor() { }

  getConfiguration(fs, workDir) {
    const fileContent = fs.readFileSync(workDir, { encoding: 'utf8', flag: 'r' });
    return JSON.parse(fileContent);
  }

  getOptions(conf, tableName = null, sysId = null, action, queryParams = null) {
    const options = this.getRequestHeader(tableName, sysId, action);
    if (action === 'query') {
      options.path = this.addParamsToPath(options.path, queryParams);
    }

    return {
      hostname: conf.instance,
      port: 443,
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': options.contentType,
        ForceUseSession: 'true',
        Authorization: conf.token,
      },
    };
  }

  addParamsToPath(rawPath, queryParams) {
    let resultStr = '';
    let i = 0;
    for (const [key, val] of queryParams) {
      resultStr += key + '=' + val;
      i++;
      if (i < queryParams.size) resultStr += '&';
    }

    return rawPath + '?' + encodeURI(decodeURIComponent(resultStr));
  }

  getRequestHeader(tableName = null, sysId = null, action) {
    const stdActions = ['auth_basic', 'auth_sso', 'insert', 'read', 'query', 'update', 'delete', 'runScript', 'quickImport'];
    const cstActions = ['attachFile'];
    let path = '';
    let method = 'POST';
    let contentType = 'application/json';

    if (stdActions.includes(action)) {
      switch (action) {
        case 'auth_basic': {
          path = `/v1/auth/login`;
          break;
        }

        case 'auth_sso': {
          path = `/v1/auth/side-door`;
          break;
        }

        case 'insert': {
          path = `/rest/v1/table/${tableName}`;
          break;
        }

        case 'read': {
          path = `/rest/v1/table/${tableName}/${sysId}`;
          method = 'GET';
          break;
        }

        case 'query': {
          path = `/rest/v1/table/${tableName}`;
          method = 'GET';
          break;
        }

        case 'update': {
          path = `/rest/v1/table/${tableName}/${sysId}`;
          method = 'PATCH';
          break;
        }

        case 'delete': {
          path = `/rest/v1/table/${tableName}/${sysId}`;
          method = 'DELETE';
          break;
        }

        case 'runScript': {
          path = `/v1/admin-script/run`;
          break;
        }

        case 'quickImport': {
          path = `/v1/import/json/`;
          break;
        }

      }
    } else if (cstActions.includes(action)) {
      switch (action) {
        case 'attachFile': {
          path = `/v1/api/itsm_itsm/soagent/attach_file`;
          method = 'POST';
          contentType = 'application/json';
          break;
        }
      }
    }

    return { method, path, contentType };
  }

  async getUserToken(https, conf, auth = 'auth_sso') {
    const options = this.getOptions(conf, null, null, auth);
    delete options.headers.Authorization;
    const obj = `{"username": "${conf.login}", "password": "${conf.password}"}`;
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            request.end();
            resolve(result);
          });
      });
      request.on('error', (error) => {
        request.end();
        console.error('Network error! Please check connection or instance domain');
      });
      request.write(obj);
      request.end();
    });

    return functionResult;
  }

  async insertRecord(https, conf, tableName, obj) {
    const options = this.getOptions(conf, tableName, null, 'insert');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            request.end();
            resolve(result);
          });
      });
      request.on('error', (error) => {
        reject(error);
        request.end();
      });
      request.write(obj);
      request.end();
    });

    return functionResult;
  }

  async readRecord(https, conf, tableName, sysId) {
    const options = this.getOptions(conf, tableName, sysId, 'read');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(result);
            request.end();
          });
      });
      request.end();
    });

    return functionResult;
  }

  async queryRecord(https, conf, tableName, queryParams) {
    const options = this.getOptions(conf, tableName, null, 'query', queryParams);
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(result);
            request.end();
          });
      });
      request.on('error', (error) => {
        reject(error);
        request.end();
      });
      request.end();
    });

    return functionResult;
  }

  async updateRecord(https, conf, tableName, sysId, obj) {
    const options = this.getOptions(conf, tableName, sysId, 'update');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            request.end();
            resolve(result);
          });
      });
      request.on('error', (error) => {
        reject(error);
        request.end();
      });
      request.write(obj);
      request.end();
    });

    return functionResult;
  }

  async deleteRecord(https, conf, tableName, sysId) {
    const options = this.getOptions(conf, tableName, sysId, 'delete');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(result);
            request.end();
          });
      });
      request.end();
    });

    return functionResult;
  }

  async attachFileToRecord(https, conf, content) {
    const options = this.getOptions(conf, null, null, 'attachFile');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(result);
            request.end();
          });
      });
      request.on('error', (error) => {
        reject(error);
        request.end();
      });
      request.write(content);
      request.end();
    });

    return functionResult;
  }

  async runScript(https, conf, scriptContent) {
    const options = this.getOptions(conf, null, null, 'runScript');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(result);
            request.end();
          });
      });
      request.on('error', (error) => {
        reject(error);
        request.end();
      });
      request.write(scriptContent);
      request.end();
    });

    return functionResult;
  }

  async quickImport(https, fs, conf, fileBaseName, filePath) {
    const options = this.getOptions(conf, null, null, 'quickImport');
    const boundary = `----WebKitFormBoundary${Math.random().toString(16).substr(2, 14)}`;
    options.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;

    const filePart = `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${fileBaseName}"\r\n` +
      `Content-Type: application/json\r\n\r\n`;

    const bodyEnd = `\r\n--${boundary}--\r\n`;

    const req = https.request(options, (res) => {
      let responseData = Buffer.alloc(0);
      res.on('data', (chunk) => {
        responseData = Buffer.concat([responseData, chunk]);
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData.toString());
          console.log('Server response:', jsonResponse);
        } catch (e) {
          console.log('Raw response:', responseData.toString());
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
    });

    req.write(filePart);

    const fileStream = fs.createReadStream(filePath);
    fileStream.on('data', (chunk) => {
      req.write(chunk);
    });

    fileStream.on('end', () => {
      req.end(bodyEnd);
    });

    fileStream.on('error', (err) => {
      console.error('File read error:', err);
      req.destroy(err);
    });
  }
}

module.exports = { SOAgentCoreMethods };