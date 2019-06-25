const Koa = require('koa');
const dfRouter = require('./src/rouers/df')
const app = new Koa();

app.use(dfRouter.routes())
app.use(dfRouter.allowedMethods())
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);
