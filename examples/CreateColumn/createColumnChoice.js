/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentTableHelper } = require('#SOAgentTableHelper');

const th = new SOAgentTableHelper(envFilePath);

(async function () {
  const data = {
    choiceAttributes: {
      title: `Choice State4`,
      column_name: `choice_state4`,
      table_id: '176147459797459398',
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
