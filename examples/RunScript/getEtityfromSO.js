const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { $ } from 'bun';

(async function () {
  const mapping = Bun.file("/tmp/snippets/workspaceDeployMapping.json");
  const map = await mapping.json();

  const args = process.argv.slice(2);
  const fullFilePath = args[0];
  
  const baseFileName = fullFilePath.split('\\').at(-1);
  const deployPath = map.entityAccordance[baseFileName];
  if (!deployPath) {
    console.log('No deploy config in workspaceDeployMapping.json');
    return;
  }
  const targetEntity = deployPath.targetEntity.split('/');
  const targetField = deployPath.targetField;

  const queryParams = {
    'sysparm_query': `sys_id=${targetEntity[1]}`,
    'sysparm_fields': [targetField],
    'sysparm_limit': "1"
  };

  const res = await sa.queryRecord(targetEntity[0], queryParams);
  const fileContent = Bun.file(fullFilePath);
  await Bun.write(fullFilePath, res[0][targetField]);
  console.log("Record secsefully syncronized from SO");

})();