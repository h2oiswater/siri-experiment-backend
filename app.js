const Koa = require('koa');
const koaBody = require('koa-body')
const dfRouter = require('./src/rouers/df')
const converterRouter = require('./src/rouers/converter')
const app = new Koa();
const path = require('path')

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(dfRouter.routes())
app.use(dfRouter.allowedMethods())
app.use(converterRouter.routes())
app.use(converterRouter.allowedMethods())
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3000);