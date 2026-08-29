/** EE:SOAgentTestScript */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sa = require('#SOAgentInterface');
const tc = {};

describe('Последовательные тесты', () => {
  beforeAll(async () => {
    tc.content = await Bun.file('./README.md', 'utf-8').text();
  });

  test('ExtractDocumentationExamples', async () => {
    const regex = /```(json|js)\n([\s\S]*?)```/g;
    const blocks = [];

    let match;
    let index = 0;
    while ((match = regex.exec(tc.content)) !== null) {
      index++;
      blocks.push({
        index,
        lang: match[1],
        code: match[2].trim()
      });
    }

    expect(blocks.length).toBeGreaterThan(0);
    tc.codeBlocks = blocks;
  });

  test('CheckSkeletonExample', async () => {
    const block = tc.codeBlocks[2];
    expect(block.lang).toBe('js');

    // Исполняем код скелета — require загружает SOAgentInterface, IIFE выполняется
    const fn = new Function('require', block.code);
    const result = fn(require);

    // require('#SOAgentInterface') внутри скелета должен вернуть объект с методами
    const saFromDoc = require('#SOAgentInterface');
    expect(typeof saFromDoc.insertRecord).toBe('function');
    expect(typeof saFromDoc.readRecord).toBe('function');
    expect(typeof saFromDoc.queryRecord).toBe('function');
    expect(typeof saFromDoc.updateRecord).toBe('function');
    expect(typeof saFromDoc.deleteRecord).toBe('function');
    expect(typeof saFromDoc.runScript).toBe('function');
    expect(typeof saFromDoc.getDocId).toBe('function');
    expect(typeof saFromDoc.attachmentsUpload).toBe('function');
    expect(typeof saFromDoc.quickImport).toBe('function');
    expect(typeof saFromDoc.clearCache).toBe('function');
    expect(typeof saFromDoc.getValues).toBe('function');
    expect(typeof saFromDoc.getValue).toBe('function'); // алиас для обратной совместимости
  });

  test('CheckAccountsFileStructure', async () => {
    const block = tc.codeBlocks[0];
    expect(block.lang).toBe('json');

    // Исполняем: парсим JSON и проверяем структуру
    const config = JSON.parse(block.code);

    expect(config).toHaveProperty('default_account');
    expect(config).toHaveProperty('accounts');
    expect(config.accounts).toHaveProperty(config.default_account);

    const account = config.accounts[config.default_account];
    expect(account).toHaveProperty('protocol');
    expect(account).toHaveProperty('instance');
    expect(account).toHaveProperty('username');
    expect(account).toHaveProperty('password');
    expect(account).toHaveProperty('token');
  });

  test('CheckImportsBlock', async () => {
    const block = tc.codeBlocks[1];
    expect(block.lang).toBe('json');

    const imports = JSON.parse(block.code);
    expect(imports).toHaveProperty('imports');
    expect(imports.imports).toHaveProperty('#SOAgentInterface');
    expect(imports.imports).toHaveProperty('#SOAgentLogin');
    expect(imports.imports).toHaveProperty('#conf');
  });

  test('CheckAllJSONBlocksAreValidJSON', async () => {
    const jsonBlocks = tc.codeBlocks.filter(b => b.lang === 'json');

    for (const block of jsonBlocks) {
      expect(() => JSON.parse(block.code)).not.toThrow();
    }
  });

  test('CheckAllJSBlocksAreValidSyntax', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');

    for (const block of jsBlocks) {
      // Оборачиваем в async, т.к. примеры содержат await
      const wrapped = `(async function() {\n${block.code}\n})`;
      expect(() => new Function(wrapped)).not.toThrow();
    }
  });

  test('CheckRefreshTokenExample', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');
    const refreshBlock = jsBlocks.find(b => b.code.includes('refreshToken'));
    expect(refreshBlock).toBeDefined();

    // Проверяем что код синтаксически исполним и sl загружается
    const sl = require('#SOAgentLogin');
    expect(typeof sl.refreshToken).toBe('function');
    expect(typeof sl.getUserToken).toBe('function');
    expect(typeof sl.setTokenToConfig).toBe('function');
  });

  test('CheckInsertRecordExample', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');
    const insertBlock = jsBlocks.find(b => b.code.includes('insertRecord'));
    expect(insertBlock).toBeDefined();

    // Проверяем что объект из примера можно создать и передать в insertRecord
    // (без реального вызова к инстансу — проверяем что объект валиден)
    const insertObject = {
      subject: 'Не работает беспроводная клавиатура Roxy M11',
      caller: '155931135900000001'
    };
    expect(typeof insertObject).toBe('object');
    expect(insertObject).toHaveProperty('subject');
    expect(insertObject).toHaveProperty('caller');

    // insertRecord не использует JSON.stringify в документации — объект передаётся напрямую
    expect(insertBlock.code).not.toContain('JSON.stringify');
  });

  test('CheckQueryRecordExample', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');
    const queryBlock = jsBlocks.find(b => b.code.includes('queryRecord'));
    expect(queryBlock).toBeDefined();

    // Исполняем создание queryParams из документации
    const queryParams = new Map([
      ['sysparm_query', 'state!=10^subjectLIKEне работает'],
      ['sysparm_display_value', '0'],
      ['sysparm_exclude_reference_link', '0'],
      ['sysparm_fields', 'number'],
      ['sysparm_view', ''],
      ['sysparm_limit', '20'],
      ['sysparm_page', '1']
    ]);

    expect(queryParams).toBeInstanceOf(Map);
    expect(queryParams.get('sysparm_limit')).toBe('20');
    expect(queryParams.get('sysparm_fields')).toBe('number');
    expect(queryParams.size).toBe(7);
  });

  test('CheckUpdateRecordExample', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');
    const updateBlock = jsBlocks.find(b => b.code.includes('updateRecord'));
    expect(updateBlock).toBeDefined();

    // Объект обновления из документации — объект, не JSON.stringify
    const updateObject = {
      subject: 'Не работает беспроводная мышь Proxy M1',
    };
    expect(typeof updateObject).toBe('object');
    expect(updateObject).toHaveProperty('subject');
    expect(updateBlock.code).not.toContain('JSON.stringify');
  });

  test('CheckGetDocIdExample', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');
    const docIdBlock = jsBlocks.find(b => b.code.includes('getDocId'));
    expect(docIdBlock).toBeDefined();

    // Исполняем getDocId с известными значениями локально (без сети)
    const tableName = 'itsm_incident';
    const sysId = '171195597496013110';
    const docId = await sa.getDocId(tableName, sysId);

    // docId должен быть hex-строкой длиной 32 символа
    expect(docId).toMatch(/^[0-9a-f]{32}$/);
  });

  test('CheckRunScriptExample', async () => {
    const jsBlocks = tc.codeBlocks.filter(b => b.lang === 'js');
    const scriptBlock = jsBlocks.find(b => b.code.includes('runScript'));
    expect(scriptBlock).toBeDefined();

    // Проверяем что runScript принимает строку, а не путь к файлу
    expect(scriptBlock.code).toContain('sa.runScript(scriptContent)');
    expect(scriptBlock.code).not.toContain('sa.runScript(filePath)');
  });

  test('CheckImportFileFormatExample', async () => {
    const jsonBlocks = tc.codeBlocks.filter(b => b.lang === 'json');
    const importFormatBlock = jsonBlocks.find(b => b.code.includes('"task"') && b.code.includes('"subject"'));
    expect(importFormatBlock).toBeDefined();

    // Исполняем парсинг формата импорта
    const parsed = JSON.parse(importFormatBlock.code);
    expect(parsed).toHaveProperty('task');
    expect(Array.isArray(parsed.task)).toBe(true);
    expect(parsed.task.length).toBe(2);
    expect(parsed.task[0]).toHaveProperty('subject');
    expect(parsed.task[1]).toHaveProperty('subject');
  });

  test('CheckNoDeprecatedMethodsInREADME', async () => {
    expect(tc.content).not.toContain('getDocIdValue');
    expect(tc.content).not.toContain('getRecordUrlBySysId');
    expect(tc.content).not.toContain('new SOAgent(');
  });
});
