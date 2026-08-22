const sa = require('#SOAgentInterface');

async function getTaskByRequest(requestId, closedAndComletedTasksInclude = false) {
  const includedStates = [
    'x5_new',
    'x5_assigned',
    'x5_pending',
    'x5_in_progress',
    'x5_approving'
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