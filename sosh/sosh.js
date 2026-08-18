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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const args = process.argv.slice(2);
const hasCommandLineArgs = args.length > 0;
const initialCommand = hasCommandLineArgs ? args[0] : null;
let isOneShot = !!hasCommandLineArgs;

const { sign } = require('crypto');
const sl = require('#SOAgentLogin');
const sa = require('#SOAgentInterface');

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
      print(table.getValue('sys_id'));
    `;

    const result = await sa.runScript(fileContent);
    console.log(result);
  },

  async getTableName(args) {
    const tableId = args[0];
    const fileContent = `
      const table = new SimpleRecord('sys_db_table');
      table.get('${tableId}');
      print(table.getValue('name'));
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
    const SOHelper = require('../src/app_layer/SOAgentIncludes.js');
    const fileContent = SOHelper.findRecordById(searchId);
    const result = await sa.runScript(fileContent);
    console.log(result);
    console.log("Searching compleate");
  },

  async instance() {
    sa.reloadConfig();
    const SOHelper = require('../src/app_layer/SOAgentIncludes.js');
    const script = SOHelper.getInstance();
    const result = await sa.runScript(script);
    console.log("Local File Path:     " + sa.conf.instance);
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

    print(choiceElements.filter((item, index) => choiceElements.indexOf(item) === index));
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

  async setScriptMapping(args) {
    if (!args[0]) {
      console.log("Ошибка! Нет обязательных атрибутов!");
      return;
    }
    const path = args[0].split('/');
    // const entityTable = path[0]; // Название таблицы
    const entityName = path[1];  // ID записи

    const fileName = args[1]?.split('\\')?.at(-1) || `${entityName}.js`;
    const fieldName = args[2] || 'script';

    if (args[0].indexOf('/') === 0) {
      args[0] = args[0].replace('/', '');
    }

    // Записать новую запись в DeployMapping
    const deployMappingDescriptor = Bun.file(sa.conf.deployMappingFilePath);
    const deployMapping = await deployMappingDescriptor.json();

    deployMapping.entityAccordance[fileName] = {
      targetEntity: args[0].replace('\\', '/'),
      targetField: fieldName,
    };

    await Bun.write(sa.conf.deployMappingFilePath, JSON.stringify(deployMapping, null, 2));
    console.log("Mapping ready");
  },

  async addInstance(args) {
    const confFilePath = require('#conf');
    const content = await Bun.file(confFilePath).json();
    const newInstance = {
      "protocol": "https",
      "instance": null,
      "login": null,
      "password": null,
      "token": null
    };
    content.accounts[args[0]] = newInstance;
    await Bun.write(confFilePath, JSON.stringify(content, null, 2));
    sa.reloadConfig();
  },

  async setAddress(args) {
    const confFilePath = require('#conf');
    const content = await Bun.file(confFilePath).json();
    const instances = [];
    for (const key of Object.keys(content.accounts)) {
      instances.push(key);
    }

    if (args[1] && !instances.includes(args[1])) {
      console.error("Нет такого инстанса!\nВозможно надо его создать при помощи команды addInstance <instanceName>");
      return;
    }
    const currentInstance = args[1] || content.default_account;
    content.accounts[currentInstance].instance = args[0];

    await Bun.write(confFilePath, JSON.stringify(content, null, 2));
    sa.reloadConfig();
  },

  // Aliases
  async gdi(args) {
    return await this.getDocId(args);
  },

  async gtn(args) {
    return await this.getTableName(args);
  },

  async gti(args) {
    return await this.getTableId(args);
  },

  async fbi(args) {
    return await this.findById(args);
  },

  async swi(args) {
    return await this.switchInstance(args);
  },

  async cc() {
    return await this.clearCache();
  },

  async st(args) {
    return await this.setToken(args);
  },

  async i() {
    return await this.instance();
  },

  async ssm(args) {
    return await this.setScriptMapping(args);
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

async function executeCommand(cmd, cmdArgs) {
  if (commands.hasOwnProperty(cmd)) {
    try {
      await commands[cmd](cmdArgs);
    } catch (e) {
      console.error('Ошибка выполнения команды:', e.message);
    }
  } else {
    console.log(`Неизвестная команда: ${cmd}`);
  }
}

if (initialCommand) {
  const cmdArgs = args.slice(1);
  await executeCommand(initialCommand, cmdArgs);
  if (isOneShot) {
    process.exit(0);
  }
}


rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();

  if (!input) {
    rl.prompt();
    return;
  }

  const [cmd, ...args] = input.split(' ');

  if (commands.hasOwnProperty(cmd)) {
    try {
      await commands[cmd](args);
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
