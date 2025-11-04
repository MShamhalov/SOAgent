/** EE:SOAgentScript */
const { envFilePath } = require('#conf');
const { SOAgentCoreMethods } = require('#SOAgentCoreMethods');

const fs = require("fs");
const sc = new SOAgentCoreMethods();
const conf = sc.getConfiguration(fs, envFilePath);
const options = sc.getOptions(conf, null, null, 'sendRequest');

(async function () {
  const queryParams = new Map([
    ['sysparm_query', 'state!=10^subjectLIKEне%20работает'],
    ['sysparm_display_value', '0'],
    ['sysparm_exclude_reference_link', '0'],
    ['sysparm_fields', ['path_name', 'sys_id']],
    ['sysparm_view', ''],
    ['sysparm_limit', '2'],
    ['sysparm_page', '1'],
  ]);

  options.path = `/rest/v1/table/task?sysparm_query=state!=10^subjectLIKEне%20работает&sysparm_querysysparm_display_value=0&sysparm_exclude_reference_link=0&sysparm_fields=number&sysparm_view=&sysparm_limit=2`;
  
  const queryString = buildQueryString(queryParams);
  options.path = '/rest/v1/table/task' + queryString;
  // sysparm_query=&sysparm_display_value=0&sysparm_exclude_reference_link=0&sysparm_fields=path_name%2Csys_id&sysparm_view=&sysparm_limit=2&sysparm_page=1

  // "/rest/v1/table/task?sysparm_query=state!=10^subjectLIKEне%20работает&sysparm_querysysparm_display_value=0&sysparm_exclude_reference_link=0&sysparm_fields=number&sysparm_view=&sysparm_limit=2"
  options.method = 'GET';

  // console.log(await sc.sendRequest(options));
})();

function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of params) {
    if (Array.isArray(value)) {
      searchParams.append(key, value.join(','));
    } else {
      searchParams.append(key, value);
    }
  }

  return searchParams.toString();
}