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

const { envFilePath } = require('#conf');
const { SOAgentLogin } = require('#SOAgentLogin');
const { SOAgentInterface } = require('#SOAgentInterface');
const { sign } = require('crypto');

const sl = new SOAgentLogin(envFilePath);
const sa = new SOAgentInterface(envFilePath);

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

  async getRecordsByDocId(args) {
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
    sa.reloadConfig();
    const SOHelper = require('../src/app_layer/soIncludes.js');
    const script = SOHelper.getInstance();
    const result = await sa.runScript(script);
    console.log("Local File Path: " + sa.conf.instance);
    console.log("simple.instance.uri: " + result);
  },

  async switchInstance(args) {
    if (args[0]) {
      await sl.switchInstance(args[0]);
    }
    sa.reloadConfig();
  },

  async clearCache() {
    console.log(await sa.clearCache());
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

  async list() {
    console.log(await sl.getInstanceList());
  },

  async setToken(args) {
    let instance = '';
    let token = '';

    if (args[1]) {
      instance = args[0];
      token = args[1];
      sl.setTokenToConfig(instance, token);
    } else {
      token = args[0];
      sl.setTokenToConfig(token);
    }
    sa.reloadConfig();
  },

  help() {
    console.log(Object.keys(commands));
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

  async cc() {
    this.clearCache();
  },
  
  st(args) {
    this.setToken(args);
  },

  async i() {
    this.instance();
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
