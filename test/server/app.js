const Koa = require('koa')
const Router = require('koa-router')
const { port } = require('./config')

const app = new Koa()
const router = new Router()

// 测试 get 请求
router.get('/', (ctx, next) => {
  ctx.body = ctx.query
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(port)