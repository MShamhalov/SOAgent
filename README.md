## SOAgent

Библиотека для работы с платформой SimpleOne из среды Bun. Без сторонних зависимостей (npm).

### Основные функции библиотеки:
- Выполнение CRUD операций c записями таблиц в SimpleOne
- Выполнение запросов в таблицы SimpleOne и получение результатов
- Загрузка вложений в SimpleOne
- Запуск серверных скриптов на стороне SimpleOne
- Быстрый импорт данных из JSON-файлов
- Очистка кеша инстанса
- В библиотеке применяется только стандартная библиотека среды Bun, без использования сторонних зависимостей (npm)

### Первые шаги
Для начала следует корректно заполнить поля в конфигурационном файле SOAgent.conf.
Шаблон конфигурационного файла:

```json
{
  "default_account": "firstInstance",
  "accounts": {
    "firstInstance": {
      "protocol": "https",
      "instance": "instance1.simpleone.ru",
      "username": "admin",
      "password": "password",
      "token": "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "secondInstance": {
      "protocol": "https",
      "instance": "instance2.simpleone.ru",
      "username": "admin",
      "password": "password",
      "token": "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
}
```

Вручную следует указывать:
- Протокол
- Адрес инстанса
- Логин (необязательно, если используется ручное получение токена)
- Пароль (необязательно, если используется ручное получение токена)
- Токен

Для работы с удалённым инстансом обязательно требуется иметь сессионный токен пользователя. Для получения токена пользователя можно воспользоваться автоматизированным либо ручным способом. Автоматизированный метод подразумевает использование методов `getUserToken()` и `setTokenToConfig()`. Автоматизированный метод не работает в среде, в которой применяется двухфакторная авторизация. Ручное получение токена осуществляется следующим образом: войти в SimpleOne от имени учётной записи с правами администратора, перейти в браузере в режим разработчика (клавиша F12) и набрать в консоли браузера `s_user.accessToken` — в ответ в браузере высветится токен.

### Настройка импортов (package.json)

SOAgent удобно использовать в качестве библиотеки как часть большего проекта. В таком случае потребуется создать в корне проекта файл `package.json` и настроить в нём секцию `imports` для использования алиасов:

```json
{
  "imports": {
    "#SOAgentCoreMethods": "./soagent/src/core_layer/SOAgentCore.js",
    "#SOAgentInterface": "./soagent/src/core_layer/SOAgentInterface.js",
    "#SOAgentLogin": "./soagent/src/core_layer/SOAgentLogin.js",
    "#SOAgentTableDictionary": "./soagent/src/dictinaries/SOAgentTableDictionary.js",
    "#conf": "./soagent/SOAgent.conf"
  }
}
```

### Скелет SOAgent скрипта

```js
const sa = require('#SOAgentInterface');

(async function () {
  // место для вашего кода
})();
```

### Получение сессионного токена пользователя

Получение и запись сессионного токена одной строкой:
```js
const sl = require('#SOAgentLogin');

await sl.refreshToken();
```

Получение и запись токена раздельно:
```js
const sl = require('#SOAgentLogin');

const token = await sl.getUserToken('auth_basic');
sl.setTokenToConfig(token);
```

`getUserToken` принимает один необязательный аргумент: `'auth_basic'` (страница `/auth/login`) — значение по умолчанию.

### Добавление записи

Задаём объект, ключами в котором выступают названия полей, а значениями — значения, которые будут помещены, и добавляем запись в таблицу:
```js
const sa = require('#SOAgentInterface');

const insertObject = {
  subject: 'Не работает беспроводная клавиатура Roxy M11',
  caller: '155931135900000001'
};
const insertedRecord = await sa.insertRecord('itsm_incident', insertObject);
```

Если требуется получить значения из только что созданной записи, используем метод `getValues()`:
```js
const recordId = sa.getValues(insertedRecord, 'sys_id');
const recordNumber = sa.getValues(insertedRecord, 'number');
const recordSubject = sa.getValues(insertedRecord, 'subject');
console.log(recordId, recordNumber, recordSubject);
```

### Чтение записи
```js
const sa = require('#SOAgentInterface');

const recordId = '151195398492734076';
const readedRecord = await sa.readRecord('itsm_incident', recordId);

console.log('sys_id: ' + sa.getValues(readedRecord, 'sys_id'));
console.log('number: ' + sa.getValues(readedRecord, 'number'));
console.log('subject: ' + sa.getValues(readedRecord, 'subject'));
```

### Запрос данных из таблицы

Запрос записей, удовлетворяющих условию, и вывод значения конкретного поля:
```js
const sa = require('#SOAgentInterface');

const queryParams = new Map([
  ['sysparm_query', 'state!=10^subjectLIKEне работает'],
  ['sysparm_display_value', '0'],
  ['sysparm_exclude_reference_link', '0'],
  ['sysparm_fields', 'number'],
  ['sysparm_view', ''],
  ['sysparm_limit', '20'],
  ['sysparm_page', '1']
]);

const records = await sa.queryRecord('itsm_incident', queryParams);
console.log(records);
```

Описание параметров:
- `sysparm_query` — Закодированная строка запроса для фильтрации результатов. Поддерживает dot-walking. Пример: `active=1`.
- `sysparm_display_value` — Тип возвращаемых данных: `1` — отображаемое значение, `0` — значение из БД. По умолчанию: `0`.
- `sysparm_exclude_reference_link` — `1` — исключить ссылки Table API для ссылочных полей, `0` — включить. По умолчанию: `0`.
- `sysparm_fields` — Список полей через запятую. Поддерживает dot-walking. Пример: `number,caller.phone`.
- `sysparm_view` — Представление формы, поля которого должны вернуться в ответе.
- `sysparm_limit` — Максимальное количество результатов. По умолчанию: `20`.
- `sysparm_page` — Номер страницы. По умолчанию: `1`.

Ни один из параметров не является обязательным и может быть пропущен.

### Обновление записи
```js
const sa = require('#SOAgentInterface');

const recordId = '151195398492734076';
const updateObject = {
  subject: 'Не работает беспроводная мышь Proxy M1',
};
const updatedRecord = await sa.updateRecord('itsm_incident', recordId, updateObject);
console.log(updatedRecord);
```

### Удаление записи
```js
const sa = require('#SOAgentInterface');

const recordId = '151195398492734076';
const deleteResult = await sa.deleteRecord('itsm_incident', recordId);
console.log(deleteResult);
```

### Запуск серверного скрипта на инстансе SimpleOne
```js
const sa = require('#SOAgentInterface');

const scriptContent = `
  const table = new SimpleRecord('sys_db_table');
  table.get('name', 'task');
  print(table.getValue('sys_id'));
`;
const result = await sa.runScript(scriptContent);
console.log(result);
```

### Получение DocId из известных TableName и RecordId
```js
const sa = require('#SOAgentInterface');

const tableName = 'itsm_incident';
const sysId = '171195597496013110';
const docId = await sa.getDocId(tableName, sysId);
console.log(docId);
```

### Загрузка файла на инстанс SimpleOne
```js
const sa = require('#SOAgentInterface');

const filePath = './attachment/file.pdf';
const recordId = '170609176898389495';

await sa.attachmentsUpload(filePath, 'task', recordId);
```

### Быстрый импорт записей из JSON-файла
```js
const sa = require('#SOAgentInterface');

const result = await sa.quickImport('./data.json');
console.log(result);
```

Формат файла для импорта:
```json
{
  "task": [
    { "subject": "Задача 1" },
    { "subject": "Задача 2" }
  ]
}
```

### Очистка кеша
```js
const sa = require('#SOAgentInterface');

const result = await sa.clearCache();
console.log(result);
```
