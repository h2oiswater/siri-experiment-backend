const Router = require('koa-router')
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const dfRouter = new Router({
  prefix: '/df'
})

dfRouter.get('/', async (ctx, next) => {
  const projectId = 'littel-ree'
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: '你好',
        // The language used by the client (en-US)
        languageCode: 'zh-CN',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
})

module.exports = dfRouter