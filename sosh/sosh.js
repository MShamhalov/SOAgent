const { sign } = require('crypto');
const SOAgent = require('../src/core_layer/SOAgentInterface.js');
const confFilePath = './examples/.env';
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const readline = require('readline');

const commands = {
  help() {
    console.log('Доступные команды: help, echo, add, exit');
  },

  async getTableId(args) {
    const tableName = args[0];
    const fileContent = `
    const table = new SimpleRecord('sys_db_table');
    table.get('name', '${tableName}');
    ss.debug(table.getValue('sys_id'));
    `;

    const result = await sa.runScript(fileContent);
    console.log(result);
  },

  async getTableName(args) {
    const tableId = args[0];
    const fileContent = `
    const table = new SimpleRecord('sys_db_table');
    table.get('${tableId}');
    ss.debug(table.getValue('name'));
    `;

    const result = await sa.runScript(fileContent);
    console.log(result);
  },

  async getDocId(args) {
    const table = args[0];
    const recordId = args[1];
    const result = await sa.getDocId(table, recordId);
    console.log(result);
  },

  async getSysIdsByDocId(args) {
    const RawDocId = args[0];
  },

  async findById(args) {
    const searchId = args[0];
    const SOHelper = require('../src/app_layer/soIncludes.js');
    fileContent = SOHelper.findRecordById(searchId);
    const result = await sa.runScript(fileContent);
    console.log(result);
  },

  async instance() {
    const SOHelper = require('../src/app_layer/soIncludes.js');
    script = SOHelper.getInstance();
    const result = await sa.runScript(script);
    console.log("Local File Path: " + sa.conf.instance);
    console.log("simple.instance.uri: " + result);
  },

  async switchInstance(args) {
    const SOLogin = require('../src/core_layer/SOLogin.js');
    const sl = new SOLogin.Login(confFilePath);
    await sl.switchInstance(args[0]);
    sa.reloadConfig();
  },

  async getChoiceValue(args) {
    const parentTableName = args[0];
    const choiceColumnName = args[1];

    const fileContent = `
    const choiceElements = [];
    const table = new SimpleRecord('sys_db_table');
    table.get('name', '${parentTableName}');

    const column = new SimpleRecord('sys_db_column');
    column.addEncodedQuery("table_id=" + table.getValue('sys_id') + "^column_name=${choiceColumnName}");
    column.setLimit(1);
    column.query();
    if (column.next()) {
      choice = new SimpleRecord('sys_choice');
      choice.addEncodedQuery('column_id='+ column.getValue('sys_id'));
      choice.query();
      while(choice.next()) {
      choiceElements.push(choice.value);
      }
    }

    ss.debug(choiceElements.filter((item, index) => choiceElements.indexOf(item) === index));
    `;

    const result = await sa.runScript(fileContent);
    console.log(result);
  },

  // Aliases
  async gdi(args) {
    this.getDocId(args)
  },

  async gtn(args) {
    this.getTableName(args)
  },

  async gti(args) {
    this.getTableId(args)
  },

  async fbi(args) {
    this.findById(args);
  },

  async swi(args) {
    this.switchInstance(args);
  },

  exit() {
    console.log('Выход из интерпретатора.');
    process.exit(0);
  }
};


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'sosh> '
});

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();

  if (!input) {
    rl.prompt();
    return;
  }

  const [cmd, ...args] = input.split(' ');

  if (commands.hasOwnProperty(cmd)) {
    try {
      commands[cmd](args);
    } catch (e) {
      console.error('Ошибка выполнения команды:', e.message);
    }
  } else {
    console.log(`Неизвестная команда: ${cmd}`);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Интерпретатор завершён');
  process.exit(0);
});
