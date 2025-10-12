const fs = require('fs');
const SOAgent = require('../../src/core_layer/SOAgentInterface.js');
const confFilePath = require('../../SOAgent.conf').envFilePath;
const sa = new SOAgent.SimpleOneAgentInterface(confFilePath);
import { $ } from 'bun';

(async function () {
  const args = process.argv.slice(2);
  const scriptFilePath = args[0];
  let fileContent = fs.readFileSync(scriptFilePath, 'utf-8');
  
  switch (readFirstLineSync(scriptFilePath)) {
    case 'soagent': {
      await $`bun ${scriptFilePath}`;
      break;
    }

    case 'soagent_test': {
      await $`bun test ${scriptFilePath}`;
      break;
    }

    case 'so_script_wp': {
      const precondition = fs.readFileSync('./examples/RunScript/precondition.js', 'utf-8');
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

function readFirstLineSync(filePath) {
  try {
    const syncContent = fs.readFileSync(filePath, 'utf8');
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