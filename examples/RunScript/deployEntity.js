const { envFilePath } = require('#conf');
const { SOAgentInterface } = require('#SOAgentInterface');

const sa = new SOAgentInterface(envFilePath);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { $ } from 'bun';

(async function () {
  const mapping = Bun.file("/tmp/snippets/workspaceDeployMapping.json");
  const map = await mapping.json();
  
  const args = process.argv.slice(2);
  const fileContent = Bun.file(args[0]);
  const scriptContent = await fileContent.text();

  const baseFileName = args[0].split('\\').at(-1);
  const deployPath = map.entityAccordance[baseFileName];
  if (!deployPath) {
    console.log('No deploy config in workspaceDeployMapping.json');
    return;
  }

  const targetEntity = deployPath.targetEntity.split('/');
  const targetField = deployPath.targetField;

  const originalContent = await sa.queryRecord(targetEntity[0], {
    'sysparm_query': `sys_id=${targetEntity[1]}`,
    'sysparm_fields': [targetField],
    'sysparm_limit': "1"
  });

  const originalHash = Bun.hash(originalContent[0][targetField]).toString();
  const newHash = Bun.hash(scriptContent).toString();

  if (originalHash === newHash) {
    console.log('Content is unchanged. No update needed.');
    return;
  }

  const updObj = {};
  updObj[targetField] = scriptContent;

  const upd = await sa.updateRecord(targetEntity[0], targetEntity[1], updObj);
  console.log('Record Deployed!');
})();