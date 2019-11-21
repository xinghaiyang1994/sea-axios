const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const koa2Cors = require('koa2-cors')
const { PORT } = require('../config/index')
const { 
  JSON_GET,
  JSON_POST,
  UPLOAD
} = require('../config/path')

const app = new Koa()
const router = new Router()

// 支持跨域
app.use(koa2Cors({
  credentials: true
}))

// 解析 post
app.use(koaBody({
  multipart: true   // 开启上传文件
}))

// get 请求
router.get(JSON_GET, ctx => {
  return ctx.body = ctx.query
})

// post 请求
router.post(JSON_POST, ctx => {
  return ctx.body = ctx.request.body
})

// 上传文件
router.post(UPLOAD, ctx => {
  console.log(ctx.request.files)
  return ctx.body = 1
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT)