const confFilePath = './examples/.env';

const TableHelper = require('../../src/app_layer/tableHelper.js');
const th = new TableHelper.SOTableHelper(confFilePath);

(async function () {
  // const index = 85;

  const data = {
    choiceAttributes: {
      title: `Choice State`,
      column_name: `choice_state`,
      table_id: '175474838106586829',
      choice_type: '1',
      active: true,
    },

    choiceOptions: [
      { title: 'Option1', value: 'option1', language: 'en', order: "1" },
      { title: 'Option2', value: 'option2', language: 'en', order: "2" },
      { title: 'Option3', value: 'option3', language: 'en', order: "3" },
      { title: 'Option4', value: 'option4', language: 'en', order: "4" },
      { title: 'Опция1', value: 'option1', language: 'ru', order: "1" },
      { title: 'Опция2', value: 'option2', language: 'ru', order: "2" },
      { title: 'Опция3', value: 'option3', language: 'ru', order: "3" },
      { title: 'Опция4', value: 'option4', language: 'ru', order: "4" },
    ],

    // tableAttributes: {
    //   name: `custom_choicetab${index}`,
    //   title: `Custom Choice Table${index}`,
    // }
  };

  await th.createChoiceColumn(data);
})();
