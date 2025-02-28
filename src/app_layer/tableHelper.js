class SOTableHelper {
  constructor(confFilePath) {
    const SOAgentIndex = require('../index.js');
    this.interface = new SOAgentIndex.SimpleOneAgentInterface(confFilePath);

    const SOAgentValidation = require('../core_layer/SOAgentValidation.js');
    this.validator = new SOAgentValidation.Validator();
  }
  
  async createTable(options) {
    if (!this.validator.checkTableAttributes(options)) {
      console.log('Error!');
      return;
    }

    const insertRecord = await this.interface.insertRecord('sys_db_table', options);
    return insertRecord;
  }
}

module.exports = { SOTableHelper };
