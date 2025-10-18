class SOAgentCoreMethods {
  constructor() { }

  getConfiguration(fs, workDir) {
    const fileContent = fs.readFileSync(workDir, { encoding: 'utf8', flag: 'r' });
    const allConfigurations = JSON.parse(fileContent);
    const defaultConfig = allConfigurations.default_account;

    return allConfigurations.accounts[defaultConfig];
  }

  getOptions(conf, tableName = null, sysId = null, action, queryParams = null) {
    const options = this.getRequestHeader(tableName, sysId, action);
    if (action === 'query') {
      options.path = this.addParamsToPath(options.path, queryParams);
    }
    const readyToken = this.addBearerToToken(conf.token);
    return {
      hostname: conf.instance,
      port: 443,
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': options.contentType,
        ForceUseSession: 'true',
        Authorization: readyToken,
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
    const stdActions = [
      'auth_basic', 
      'auth_sso', 
      'insert', 
      'read', 
      'query', 
      'update', 
      'delete', 
      'runScript', 
      'quickImport', 
      'clearCache', 
      'attachmentsUpload'
    ];
    const cstActions = [
      'attachFile'
    ];
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
          path = `/v1/import/json`;
          break;
        }

        case 'clearCache': {
          path = `/v1/settings/flush-cache?access-token=`;
          method = 'GET';
          break;
        }

        case 'attachmentsUpload': {
          path = `/v1/attachments/upload/${tableName}/${sysId}`;
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

    return new Promise((resolve, reject) => {
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
  }

  async insertRecord(https, conf, tableName, obj) {
    const options = this.getOptions(conf, tableName, null, 'insert');

    return new Promise((resolve, reject) => {
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
  }

  async readRecord(https, conf, tableName, sysId) {
    const options = this.getOptions(conf, tableName, sysId, 'read');

    return new Promise((resolve, reject) => {
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
  }

  async queryRecord(https, conf, tableName, queryParams) {
    const options = this.getOptions(conf, tableName, null, 'query', queryParams);

    return new Promise((resolve, reject) => {
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
  }

  async updateRecord(https, conf, tableName, sysId, obj) {
    const options = this.getOptions(conf, tableName, sysId, 'update');

    return new Promise((resolve, reject) => {
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
  }

  async deleteRecord(https, conf, tableName, sysId) {
    const options = this.getOptions(conf, tableName, sysId, 'delete');

    return new Promise((resolve, reject) => {
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
  }

  async runScript(https, conf, scriptContent) {
    const options = this.getOptions(conf, null, null, 'runScript');

    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .setEncoding('utf8')
          .on('data', (chunk) => {
            result += chunk;
          })
          .on('end', () => {
            resolve(result);
          });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.setTimeout(15000, () => {
        request.destroy(new Error('Request timeout'));
      });

      request.write(scriptContent);
      request.end();
    });
  }

  async quickImport(https, fs, conf, fileBaseName, filePath) {
    const options = this.getOptions(conf, null, null, 'quickImport');

    return new Promise((resolve, reject) => {
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
            const jsonResponse = responseData.toString();
            resolve(jsonResponse);
          } catch (e) {
            console.error(e);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Request error:', error);
        reject(error); // Возвращаем ошибку
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
        reject(err);
        req.destroy(err);
      });
    });
  }

  async attachmentsUpload(https, fs, conf, fileBaseName, filePath, tableName, recordId) {
    const options = this.getOptions(conf, tableName, recordId, 'attachmentsUpload');

    return new Promise((resolve, reject) => {
      const req = https.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function (chunk) {
          try {
            const body = Buffer.concat(chunks);
            const jsonResponse = body.toString();
            resolve(jsonResponse);
          } catch (e) {
            console.error(e);
          }
        });

        res.on("error", function (error) {
          console.error(error);
        });
      });

      const boundary = `----WebKitFormBoundary${Math.random().toString(16).substr(2, 14)}`;
      const header = Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="files[]"; filename="${fileBaseName}"\r\n` +
        `Content-Type: application/octet-stream\r\n\r\n`,
        'utf-8'
      );

      const footer = Buffer.from(`\r\n--${boundary}--`, 'utf-8');
      const fileData = fs.readFileSync(filePath);
      const postData = Buffer.concat([header, fileData, footer]);

      req.setHeader('content-type', `multipart/form-data; boundary=${boundary}`);
      req.setHeader('Content-Length', postData.length);

      req.write(postData);
      req.end();
    });
  }

  async clearCache(https, conf) {
    const options = this.getOptions(conf, null, null, 'clearCache');
    options.path += options.headers.Authorization.slice(7);
    delete options.headers;

    return new Promise((resolve, reject) => {
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
  }

  addBearerToToken(tokenCandidate) {
    let result = tokenCandidate;
    if (tokenCandidate.substring(0, 7) !== 'Bearer ') {
      result = "Bearer " + tokenCandidate
    }

    return result;
  }

  _dbgBufferToHexString(buffer) {
    return buffer.toString('hex');
  }
}

module.exports = { SOAgentCoreMethods };