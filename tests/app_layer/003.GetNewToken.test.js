const { envFilePath } = require('#conf');
const { SOAgentLogin } = require('#SOAgentLogin');

const sl = new SOAgentLogin(envFilePath);

test('Get New Token', async () => {
  const token = await sl.getUserToken();
  expect(token).toMatch(new RegExp(/[A-Za-z0-9-_]{32}/));
});
