const Koa = require('koa')
const koaBody = require('koa-body')
const koa2Cors = require('koa2-cors')
const { PORT } = require('../config/index')
const router = require('./router')

const app = new Koa()

// 支持跨域
app.use(koa2Cors({
  credentials: true
}))

// 解析 post
app.use(koaBody({
  multipart: true   // 开启上传文件
}))

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 200
    ctx.body = {
      code: -1,
      message: err.message,
      data: ''
    }
  }
})

router(app)

app.listen(PORT)