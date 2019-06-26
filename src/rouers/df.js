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

  let sessionPath = ctx.request.query.sessionPath
  let text = ctx.request.query.text

  const sessionClient = new dialogflow.SessionsClient();
  if (!sessionPath) {
    // Create a new session
    sessionPath = sessionClient.sessionPath(projectId, sessionId);
  }


  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text,
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
    ctx.body = {
      fulfillmentText: result.fulfillmentText,
      sessionPath: sessionPath
    }
  } else {
    console.log(`  No intent matched.`);
    ctx.body = {
      fulfillmentText: '我不知所措',
      sessionPath: sessionPath
    }
  }

})

module.exports = dfRouter