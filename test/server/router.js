const Router = require('koa-router')
const { validateContentType } = require('./tool')
const { 
  JSON_GET,
  JSON_POST,
  UPLOAD,
  FORM_GET,
  FORM_POST,
  INTERCEPT_INITTRANSFORMRESPONSEFN,
  INTERCEPT_INITTRANSFORMREQUESTFN,
  INTERCEPT_INITTRANSFORMPARAMS,
  INTERCEPT_INITTRANSFORMDATA
} = require('../config/path')

module.exports = function(app) {
  const router = new Router()

  // json get 请求
  router.get(JSON_GET, ctx => {
    return ctx.body = ctx.query
  })

  // json post 请求
  router.post(JSON_POST, ctx => {
    if (!validateContentType(ctx, 'json')) {
      throw new Error('格式错误!')
    }
    return ctx.body = ctx.request.body
  })

  // 上传文件
  router.post(UPLOAD, ctx => {
    console.log(ctx.request.files)
    return ctx.body = ctx.request.files.file.name
  })

  // form get 请求
  router.get(FORM_GET, ctx => {
    return ctx.body = ctx.query
  })

  // form post 请求
  router.post(FORM_POST, ctx => {
    console.log(1, ctx.request.header['content-type'])
    if (!validateContentType(ctx, 'form')) {
      throw new Error('格式错误!')
    }
    return ctx.body = ctx.request.body
  })

  // initTransformResponseFn
  router.post(INTERCEPT_INITTRANSFORMRESPONSEFN, ctx => {
    const { isLogin } = ctx.request.body
    let code = isLogin ? 0 : -2
    return ctx.body = {
      code
    }
  })

  // initTransformResponseFn
  router.post(INTERCEPT_INITTRANSFORMREQUESTFN, ctx => {
    return ctx.body = {
      token: ctx.request.header.token
    }
  })

  // initTransformParams
  router.get(INTERCEPT_INITTRANSFORMPARAMS, ctx => {
    return ctx.body = ctx.query
  })

  // initTransformData
  router.post(INTERCEPT_INITTRANSFORMDATA, ctx => {
    return ctx.body = ctx.request.body
  })


  


  





  app.use(router.routes()).use(router.allowedMethods())

}