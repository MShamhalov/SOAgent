const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { $ } from 'bun';

(async function () {
  const args = process.argv.slice(2);
  const scriptFilePath = args[0];
  let fileContent = await Bun.file(scriptFilePath).text();
  
  switch (await readFirstLineSync(scriptFilePath)) {
    case 'soagent': {
      await $`bun ${scriptFilePath}`;
      break;
    }

    case 'soagent_test': {
      await $`bun test ${scriptFilePath}`;
      break;
    }

    case 'so_script_wp': {
      const precondition = await Bun.file('./examples/RunScript/precondition.js').text();
      
      fileContent = precondition + fileContent;
      const taskTableSysId = await sa.runScript(fileContent);
      console.log(taskTableSysId);
      break;
    }

    case 'so_script': {
      const taskTableSysId = await sa.runScript(fileContent);
      console.log(taskTableSysId);
      break;
    }
  }
})();

async function readFirstLineSync(filePath) {
  try {
    const syncContent = await Bun.file(filePath).text();
    const executionEnviroment = syncContent.split('\n')[0];
    const envType = executionEnviroment.match(/EE:(\w+)/)?.[1];

    switch (envType) {
      case 'SOAgentScript': {
        return 'soagent';
      }
      case 'SOAgentTestScript': {
        return 'soagent_test';
      }
      default: {
        const patterns = {
          businessRule: /executeRule\(current,\s*previous\s*=\s*null/,
          eventAction: /executeEventScript\(event\)/,
          apiAction: /\(function\s*\(\s*request,\s*response\s*\)/,
          dynamicFilter: /\(function\s*executeDynamicScript\(\s*current\s*=\s*null/
        };

        if (
          patterns.businessRule.test(executionEnviroment) ||
          patterns.eventAction.test(executionEnviroment) ||
          patterns.apiAction.test(executionEnviroment) ||
          patterns.dynamicFilter.test(executionEnviroment)
        ) {
          return 'so_script_wp';
        }
        return 'so_script';
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}