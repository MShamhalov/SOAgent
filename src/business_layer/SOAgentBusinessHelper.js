const sa = require('#SOAgentInterface');

async function getTaskByRequest(requestId, closedAndComletedTasksInclude = false) {
  const includedStates = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10'
  ];
  if (closedAndComletedTasksInclude) {
    includedStates.push('x5_completed', 'x5_closed');
  }

  const queryParams = {
    query: `request=${requestId}^stateIN${includedStates.join('@')}`,
    fields: ['sys_id', 'number'],
  };
  const result = await sa.queryRecord('itsm_request_task', queryParams);

  return result;
}

module.exports =  {getTaskByRequest};