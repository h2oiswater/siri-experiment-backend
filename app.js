const Koa = require('koa');
const bodyparser = require('koa-bodyparser')
const dfRouter = require('./src/rouers/df')
const app = new Koa();

app.use(bodyparser())
app.use(dfRouter.routes())
app.use(dfRouter.allowedMethods())
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
