/** EE:SOAgentScript */
// TODO: Заменить на конфигурацию TLS-сертификатов для самоподписанных инстансов
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const sa = require('#SOAgentInterface');

import { $ } from 'bun';

(async function () {
  const mapping = Bun.file("tmp/snippets/workspaceDeployMapping.json");
  const map = await mapping.json();

  const args = process.argv.slice(2);
  const fullFilePath = args[0];
  
  const baseFileName = fullFilePath.split('\\').at(-1);
  const deployPath = map.entityAccordance[baseFileName];
  if (!deployPath) {
    console.error('No deploy config in workspaceDeployMapping.json');
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
  console.log("Record successfully synchronized from SO");

})();