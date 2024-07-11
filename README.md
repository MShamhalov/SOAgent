### Основные функции библиотеки:
- Выполнение CRUD операций c записями таблиц в SimpleOne
- Выполнение запросов в таблицы SimpleOne и получение результатов (sys_id)*
- Загрузка вложений в SimpleOne*
- Запуск серверных скриптов на стороне SimpleOne.
- Доступный API с документацией
- Поддержка протокола https 
- В библиотеке применяется только стандартная библиотека NodeJS, без использования сторонних зависимостей (npm)
- В библиотеке используется асинхронное взаимодействия (Promise), что позволяет выполнять следующие операции только после успешного завершения предыдущих, и при этом избегать вложенных друг в друга callback-функций (callback hell).\
\* Осуществляется только при установке дополнительного sop-файла 'ShMG SOAgent RestAPI Pack.sop' для приложения ITSM

### Первые шаги
Для начала следует корректно заполнить поля в конфигурационном файле SOAgent.conf. Для получения токена пользователя следует осуществить вход от имени учетной записи с правами администратора на инстансе SimpleOne. Далее перейти в браузере в режим разработчика (Клавиша F12) и набрать в консоли браузера 's_user.accessToken' в ответ в браузере высветится токен. Внимание! При внесении токена в конфигурационный файл, надо перед ним установить приставку - "Bearer" с пробелом (Чтобы получилось: "token": "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",). 
Указать в том же файле адрес инстанса.

### Скелет скрипта
```
import SOAgent from '../modules/SOAgentInterface.js';

const confFilePath = './SOAgent.conf';
const sa = new SOAgent(confFilePath);

(async function () {
  // место для вашего кода

})();
```

### Получение сессионного токена пользователя
```
  const token = await sa.getUserToken();
  sa.setTokenToConfig(confFilePath, token);
```

### Добавление объекта
Задаем объект, ключами в котором выступают названия полей, а значениями - значения которые будут помещены
и добавляем запись в таблицу itsm_incident
```
const insertObject = JSON.stringify({
  subject: 'Не работает беспроводная клавиатура Roxy M11',
});
const insertedRecordString = await sa.insertRecord('itsm_incident', insertObject);
```

Если требуется получить какие-то значения из только что созданной записи, используем метод getValue()
```
const recordId = sa.getValue(insertedRecordString, 'sys_id');
const recordNumber = sa.getValue(insertedRecordString, 'number');
const recordSubject = sa.getValue(insertedRecordString, 'subject');
console.log(recordId, recordNumber, recordSubject);
```

### Чтение объекта
```
const recordId = '151195398492734076';
const readedRecordString = await sa.readRecord('itsm_incident', recordId);

console.log('sys_id: ' + sa.getValue(readedRecordString, 'sys_id'));
console.log('namber: ' + sa.getValue(readedRecordString, 'number'));
console.log('subject: ' + sa.getValue(readedRecordString, 'subject'));
```

### Запрос данных из таблицы
Запрос всех записей удовлетворяющих условию записей и вывод значения конкретного поля из этих записей
```
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

### Обновление объекта 
```
const recordId = '151195398492734076';
const updateObject = JSON.stringify({
  subject: 'Не работает беспроводная мышь Proxy M1',
});
const updatedRecordString = await sa.updateRecord('itsm_incident', recordId, updateObject);
console.log(updatedRecordString);
```

### Удаление объекта
```
const recordId = '151195398492734076';
const deleteRecordString = await sa.deleteRecord('itsm_incident', recordId);
console.log(deleteRecordString);
```

### Запуск скрипта из локального файла - на инстансе SimpleOne и получение результата
```
const filePath = './SimpleOne/SOAgent/attachs/script1.js';
const result = await sa.runScript(filePath);
console.log(result);
```

### Получение DocId из известных TableName и RecordId*
```
const tableName = 'itsm_incident';
const sysId = '171195597496013110';
const DocId = await sa.getDocIdValue(tableName, sysId);
console.log(DocId);
```

### Загрузка файла на инстанс SimpleOne*
Есть ограничения на размер файла который может быть загружен таким образом (ок. 65МБ).
```
const tableName = 'itsm_incident';
const sysId = '171195597496013110';
const DocId = await sa.getDocIdValue(tableName, sysId);

const filePath = './SimpleOne/SOAgent/attachs/video2.mkv';
const attachId = await sa.attachFileToRecord(DocId, filePath);
console.log(attachId);
```
\* Осуществляется только при установке дополнительного sop-файла 'ShMG SOAgent RestAPI Pack.sop' для приложения ITSM

### Поиск сущности по известному sys_id
```
console.log(await sa.getRecordUrlBySysId('170609176898389495'))
```

### Примеры использования
1. Запрос из таблицы всех записей удовлетворяющих условию и вытягивание номера запроса из каждой записи.
```
const queryString = 'state!=10^subjectLIKEне работает';
const getRecordsByQuery = await sa.queryRecord('itsm_incident', queryString);
for (current of getRecordsByQuery.result){
  const readedRecordString = await sa.readRecord('itsm_incident', current);
  const number = sa.getValue(readedRecordString, 'number');
  console.log(number);
}
```
