const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);

describe('Последовательные тесты', () => {
  let delLink = '';
  let recordId = '';
  const filePath = './file.svg';

  test('Create File', async () => {
    const fileContent = '<?xml version="1.0" ?><svg width="800px" height="800px" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1 {fill: #699f4c;fill-rule: evenodd;}</style></defs><path class="cls-1" d="M800,510a30,30,0,1,1,30-30A30,30,0,0,1,800,510Zm-16.986-23.235a3.484,3.484,0,0,1,0-4.9l1.766-1.756a3.185,3.185,0,0,1,4.574.051l3.12,3.237a1.592,1.592,0,0,0,2.311,0l15.9-16.39a3.187,3.187,0,0,1,4.6-.027L817,468.714a3.482,3.482,0,0,1,0,4.846l-21.109,21.451a3.185,3.185,0,0,1-4.552.03Z" id="check" transform="translate(-770 -450)"/></svg>';

    await Bun.write(filePath, fileContent);
    const fileSize = Bun.file(filePath).size;

    expect(fileSize).toEqual(539);
  });

  test('Insert Record', async () => {
    const insertObject = {
      subject: 'Не работает беспроводная клавиатура Roxy M17',
    };
    insertRecord = await sa.insertRecord('task', insertObject);
    recordId = sa.getValue(insertRecord, 'sys_id');
    expect(recordId).toMatch(new RegExp(/\d{18}/));
  });

  test('Upload File To Record', async () => {
    await sa.attachmentsUpload(filePath, 'task', recordId);
  });

  test('Delete File', async () => {
    const file = Bun.file(filePath);
    await file.delete();
    expect(await file.exists()).toBeFalsy();
  });

  test('Delete Attachment', async () => {
    // fs.unlinkSync(filePath);
    // expect(fs.existsSync(filePath)).toBeFalsy();
  });

  test('Delete Record', async () => {
    const deleteRecordString = await sa.deleteRecord('task', recordId);
    expect(['Records successfully deleted.', 'Записи успешно удалены.']).toContain(deleteRecordString.description);
  });
});
