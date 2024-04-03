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
import SOAgent from './modules/SOAgentInterface.js';
const sa = new SOAgent();

(async function () {
  // место для вашего кода

})();
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

### Запрос данных из таблицы*
Запрос всех записей удовлетворяющих условию (custom) записей и вывод значения конкретного поля из этих записей
```
const queryString = 'state!=10^subjectLIKEне работает';
const getRecordsByQuery = await sa.queryRecord('itsm_incident', queryString);
console.log(getRecordsByQuery);
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

### Примеры использования
1. Запрос из таблицы всех записей удовлетворяющих условию и вытягивание номера запроса из каждой записи.
```
const queryString = 'state!=10^subjectLIKEне работает';
const getRecordsByQuery = await sa.queryRecord('itsm_incident', queryString);
getRecordsByQuery.result.forEach(async (current) => {
  const readedRecordString = await sa.readRecord('itsm_incident', current);
  const number = sa.getValue(readedRecordString, 'number');
  console.log(number);
});
```