const sa = require('#SOAgentInterface');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { $ } from 'bun';
import path from 'path';

(async function () {
  const args = process.argv.slice(2);
  const scriptFilePath = args[0];
  const scriptFolderPath = path.dirname(scriptFilePath);
  const ext = scriptFilePath.split('.').pop();
  let fileContent = await Bun.file(scriptFilePath).text();

  if (ext !== 'js') {
    console.error("Not executable file");
    return;
  }

  switch (await readFirstLineSync(scriptFilePath)) {

    case 'soagent': {
      await $`bun ${scriptFilePath}`;
      break;
    }

    case 'soagent_test': {
      try {
        const testScenarioPath = `${scriptFolderPath}/testScenario.json`;
        let testScenario;
        if (await Bun.file(testScenarioPath).exists()) {
          testScenario = await Bun.file(testScenarioPath).json();
        }

        if (!testScenario) {
          await $`bun test ${scriptFilePath}`;
          return;
        }

        const activeScenarios = Object.entries(testScenario.scenarios)
          .filter(([_, scenario]) => scenario.active)
          .map(([name, scenario]) => ({ name, ...scenario }));

        for (const scenario of activeScenarios) {
          const tests = scenario.flow.join('|');
          await $`bun test ${scriptFilePath} -t ${tests}`;
        }
      } catch (err) {
        console.error("Tecт провален: " + err);
      }
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

    case 'soemu_base': {
      await $`bun run ./soemu/src/cli.ts run ${scriptFilePath}`;
      break;
    }

    case 'soemu_business_process': {
      await $`bun run ./soemu/src/cli.ts run-with-rules ${scriptFilePath} ./soemu/tmp/business_rules.json`;
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

      case 'SOEmuBase': {
        return 'soemu_base';
      }

      case 'SOEmuBP': {
        return 'soemu_business_process';
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