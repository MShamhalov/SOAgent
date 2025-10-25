### Основные функции библиотеки:
- Выполнение CRUD операций c записями таблиц в SimpleOne
- Выполнение запросов в таблицы SimpleOne и получение результатов
- Загрузка вложений в SimpleOne
- Запуск серверных скриптов на стороне SimpleOne
- Доступный API с документацией
- В библиотеке применяется только стандартная библиотека среды Bun, без использования сторонних зависимостей (npm)

### Первые шаги
Для начала следует корректно заполнить поля в конфигурационном файле SOAgent.conf.
Шаблон конфигурационного файла:
Вручную следует указывать 
- Протокол
- Адрес инстанса.
- Логин (необязательно)
- Пароль (необязательно)
- Токен

```json
{
  "default_account": "firstInstance",
  "accounts": {
    "firstInstance": {
      "protocol": "https",
      "instance": "instance1.simpleone.ru",
      "login": "admin",
      "password": "password",
      "token": "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    },
    "secondInstance": {
      "protocol": "https",
      "instance": "instance2.simpleone.ru",
      "login": "admin",
      "password": "password",
      "token": "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
}
```
Для работы с удаленным инстансом обязательно требуется иметь сессионный токен пользователя. Для получения токена пользователя можно воспользоваться автоматизированным либо ручным способом получения токена. Автоматизированный метод подразумевает использование методов getUserToken() и setTokenToConfig(). Автоматизированный метод не работает в среде в которой применяется двуфакторная авторизация. Ручное получение токена осуществляется следующим образом: Для начала надо вхойти в SimpleOne от имени учетной записи с правами администратора, перейти в браузере в режим разработчика (Клавиша F12) и набрать в консоли браузера 's_user.accessToken' в ответ в браузере высветится токен. 

Вам также может потребоваться в корне своего проекта создать файл package.json и настроить в нем секцию import для того чтобы в дальнейшем использовать в своих скриптах алиасы вместо полных путей к файлам библиотеки.   
```json
  "imports": {
    "#SOAgentCore": "./soagent/src/core_layer/SOAgentCore.js",
    "#SOAgentInterface": "./soagent/src/core_layer/SOAgentInterface.js",
    "#SOAgentLogin": "./soagent/src/core_layer/SOAgentLogin.js",
    "#SOAgentTableDictionary": "./soagent/src/core_layer/SOAgentTableDictionary",
    "#conf": "./soagent/SOAgent.conf"
  }
```


### Скелет скрипта
```js
import SOAgent from '../modules/SOAgentInterface.js';

const confFilePath = './SOAgent.conf';
const sa = new SOAgent(confFilePath);

(async function () {
  // место для вашего кода

})();
```

### Получение сессионного токена пользователя
```js
  await sa.refreshToken(confFilePath, 'auth_sso');
```
Получение и запись сессионного токена одной строкой (объединяет результат двух методов  - getUserToken() и setTokenToConfig())

```js
  const token = await sa.getUserToken('auth_basic');
  sa.setTokenToConfig(confFilePath, token);
```
getUserToken имеет один необязательный строковый аргумент со значенями 'auth_basic' либо 'auth_sso' в зависимости от того, посредством какой из страниц производится аутентификация - /auth/login (auth_basic) либо /auth/side-door (auth_sso), по умолчанию используется страница /auth/side-door.

### Добавление объекта
Задаем объект, ключами в котором выступают названия полей, а значениями - значения которые будут помещены
и добавляем запись в таблицу itsm_incident
```js
const insertObject = JSON.stringify({
  subject: 'Не работает беспроводная клавиатура Roxy M11',
});
const insertedRecordString = await sa.insertRecord('itsm_incident', insertObject);
```

Если требуется получить какие-то значения из только что созданной записи, используем метод getValue()
```js
const recordId = sa.getValue(insertedRecordString, 'sys_id');
const recordNumber = sa.getValue(insertedRecordString, 'number');
const recordSubject = sa.getValue(insertedRecordString, 'subject');
console.log(recordId, recordNumber, recordSubject);
```

### Чтение объекта
```js
const recordId = '151195398492734076';
const readedRecordString = await sa.readRecord('itsm_incident', recordId);

console.log('sys_id: ' + sa.getValue(readedRecordString, 'sys_id'));
console.log('number: ' + sa.getValue(readedRecordString, 'number'));
console.log('subject: ' + sa.getValue(readedRecordString, 'subject'));
```

### Запрос данных из таблицы
Запрос всех записей удовлетворяющих условию записей и вывод значения конкретного поля из этих записей
```js
  const queryParams = new Map([
    ['sysparm_query', 'state!=10^subjectLIKEне работает'],
    ['sysparm_display_value', '0'],
    ['sysparm_exclude_reference_link', '0'],
    ['sysparm_fields', 'number'],
    ['sysparm_view', ''],
    ['sysparm_limit', '20'],
    ['sysparm_page', '1']
  ]);
  
  const getRecordsByQuery = await sa.queryRecord('itsm_incident', queryParams);
  console.log(getRecordsByQuery.data);
```
где:
- sysparm_query - Закодированная строка запроса, которая используется для фильтрации результатов. Параметр поддерживает использование dot-walking.
Пример значения: active=1.
Для создания сложного запроса, используйте системные названия операторов и строку условий.
- sysparm_display_value - Флаг, определяющий тип возвращаемых данных. Валидные значения:
1 – возвращает отображаемое значение поля.
0 – возвращает значение поля из базы данных.
Значение по умолчанию: 0.
- sysparm_exclude_reference_link - 1 – исключить ссылки Table API для ссылочных полей.
0 – включить ссылки Table API для ссылочных полей.
Значение по умолчанию: 0.
- sysparm_fields - Список полей, разделенных запятой, которые должны вернуться в ответе. Параметр поддерживает использование dot-walking.
Dot-walking не работает для таблицы Запланированные задания (sys_schedule_job), ее дочерних таблиц и таблицы Индикаторы (sys_indicator), так как после создания запись проходит обработку и не сразу появляется в базе данных.
Пример значения: number,caller.phone
- sysparm_view - Представление формы, поля которого должны вернуться в ответе. Обратите внимание, что этот параметр может быть переопределен параметром sysparm_fields.
Из набора колонок представления, указанного в sysparm_view, выводятся только те, что указаны в sysparm_fields. Если указаны поля в sysparm_fields, которых нет в выбранном представлении, оно не выведется.
Если параметр не задан, в ответе на запрос возвращаются значения всех колонок таблицы.
- sysparm_limit - Максимальное количество результатов, возвращаемое запросом.
Значение по умолчанию: 20.
- sysparm_page - Номер страницы, с которой начнется чтение. Например, если значение параметра sysparm_limit – 40, а у sysparm_page значение равно двум, то ответ будет включать записи 21–60..
Значение по умолчанию: 1.

Ни один из описанных параметров не является обязательным и может быть пропущен

### Обновление объекта 
```js
const recordId = '151195398492734076';
const updateObject = JSON.stringify({
  subject: 'Не работает беспроводная мышь Proxy M1',
});
const updatedRecordString = await sa.updateRecord('itsm_incident', recordId, updateObject);
console.log(updatedRecordString);
```

### Удаление объекта
```js
const recordId = '151195398492734076';
const deleteRecordString = await sa.deleteRecord('itsm_incident', recordId);
console.log(deleteRecordString);
```

### Запуск скрипта из локального файла - на инстансе SimpleOne и получение результата
```js
const filePath = './SimpleOne/SOAgent/attachs/script1.js';
const result = await sa.runScript(filePath);
console.log(result);
```

### Получение DocId из известных TableName и RecordId
```js
const tableName = 'itsm_incident';
const sysId = '171195597496013110';
const DocId = await sa.getDocIdValue(tableName, sysId);
console.log(DocId);
```

### Загрузка файла на инстанс SimpleOne
```js
const filePath = './attachment/file.pdf';
const recordId = '170609176898389495';

await sa.attachmentsUpload(filePath, 'task', recordId);
```

### Поиск сущности по известному sys_id
```js
console.log(await sa.getRecordUrlBySysId('170609176898389495'))
```
