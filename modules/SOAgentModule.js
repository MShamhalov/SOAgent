export default class SimpleOneAgent {
  constructor() {}

  getConfiguration(fs, workDir) {
    return JSON.parse(fs.readFileSync(workDir));
  }

  getOptions(conf, tableName = null, sysId = null, action) {
    const options = this.getPathAndMethod(tableName, sysId, action);

    return {
      hostname: conf.instance,
      port: 443,
      path: options.path,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ForceUseSession: 'true',
        Authorization: conf.token,
      },
    };
  }

  getPathAndMethod(tableName = null, sysId = null, action) {
    const stdActions = ['insert', 'read', 'update', 'delete', 'runScript'];
    const cstActions = ['query', 'docid', 'attachFile'];
    let path = '';
    let method = '';

    if (stdActions.includes(action)) {
      switch (action) {
        case 'insert':
          path = `/rest/v1/table/${tableName}`;
          method = 'POST';
          break;

        case 'read':
          path = `/rest/v1/table/${tableName}/${sysId}`;
          method = 'GET';
          break;

        case 'update':
          path = `/rest/v1/table/${tableName}/${sysId}`;
          method = 'PATCH';
          break;

        case 'delete':
          path = `/rest/v1/table/${tableName}/${sysId}`;
          method = 'DELETE';
          break;

        case 'runScript':
          path = `/v1/admin-script/run`;
          method = 'POST';
          break;
      }
    } else if (cstActions.includes(action)) {
      switch (action) {
        case 'query':
          path = `/v1/api/itsm_itsm/soagent/query?table_name=${tableName}`;
          method = 'POST';
          break;

        case 'docid':
          path = `/v1/api/itsm_itsm/soagent/docid?table_name=${tableName}&record_id=${sysId}`;
          method = 'GET';
          break;

        case 'attachFile':
          path = `/v1/api/itsm_itsm/soagent/attach_file`;
          method = 'POST';
          break;
      }
    } else {
    }

    return { method, path };
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

  async queryRecord(https, conf, tableName, queryString) {
    const options = this.getOptions(conf, tableName, null, 'query');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(JSON.parse(result));
            request.end();
          });
      });
      request.on('error', (error) => {
        reject(error);
        request.end();
      });
      request.write(queryString);
      request.end();
    });

    return functionResult;
  }

  async getDocIdValue(https, conf, tableName, sysId) {
    const options = this.getOptions(conf, tableName, sysId, 'docid');
    const functionResult = new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let result = '';
        response
          .on('data', (data) => {
            result += data;
          })
          .on('end', (er) => {
            resolve(JSON.parse(result).DocId);
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
            resolve(JSON.parse(result).data.info.replace('Debug: ', ''));
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
}
