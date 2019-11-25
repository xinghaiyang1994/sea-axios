const expect = require('chai').expect
const childProcess = require('child_process')
const path = require('path')

const ajaxInt = require('../dist/index').default()
const { 
  INTERCEPT_INITTRANSFORMRESPONSEFN,
  INTERCEPT_INITTRANSFORMREQUESTFN,
  INTERCEPT_INITTRANSFORMPARAMS,
  INTERCEPT_INITTRANSFORMDATA,
  INTERCEPT_INITTRANSFORMRESPONSEERRORFN
} = require('./config/api')

let child

before(async function () {
  child = await childProcess.exec(`node ${path.join(__dirname, './server/app.js')}`)
  await new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})

describe('拦截函数', function () {
  describe('响应拦截', function () {
    it(`initTransformResponseFn`, async function () {
      const MESSAGE = {
        NO_LOGIN: '未登录',
        LOGIN: '已登录'
      }
      let initTransformResponseFnCode   // 用于标识是否登录
      const ajax = ajaxInt({
        initTransformResponseFn (res) {
          if (res.status === 200 && res.data.code === -2) {
            return initTransformResponseFnCode = MESSAGE.NO_LOGIN
          }
          initTransformResponseFnCode = MESSAGE.LOGIN
          return res
        }
      })
      
      // 未登录,全局拦截
      await ajax({
        url: INTERCEPT_INITTRANSFORMRESPONSEFN,
        data: {
          isLogin: 0
        }
      })
      expect(initTransformResponseFnCode).to.be.equal(MESSAGE.NO_LOGIN)
  
      // 已登录,全局拦截
      await ajax({
        url: INTERCEPT_INITTRANSFORMRESPONSEFN,
        data: {
          isLogin: 1
        }
      })
      expect(initTransformResponseFnCode).to.be.equal(MESSAGE.LOGIN)
  
      // 未登录,单个拦截
      await ajax({
        url: INTERCEPT_INITTRANSFORMRESPONSEFN,
        data: {
          isLogin: 0
        },
        config: {
          transformResponseFn(res) {
            if (res.status === 200 && res.data.code === -2) {
              return initTransformResponseFnCode = ''
            }
            return res
          }
        }
      })
      expect(initTransformResponseFnCode).to.be.equal('')
    })
  
    it(`transformResponseFn`, async function () {
      let initTransformResponseFnCode   // 用于标识是否登录
      const ajax = ajaxInt()
      
      // 未登录,单个拦截
      await ajax({
        url: INTERCEPT_INITTRANSFORMRESPONSEFN,
        data: {
          isLogin: 0
        },
        config: {
          transformResponseFn(res) {
            if (res.status === 200 && res.data.code === -2) {
              return initTransformResponseFnCode = ''
            }
            return res
          }
        }
      })
      expect(initTransformResponseFnCode).to.be.equal('')
    })
  })
  
  describe('请求拦截', function () {
    it(`initTransformRequestFn`, async function () {
      const TOKEN = {   // token 标识
        ONE: 'one',
        TWO: 'two'
      }
      const ajax = ajaxInt({
        initTransformRequestFn (config) {
          config.headers.common.token = TOKEN.ONE
          return config
        }
      })
      
      // 验证全局 token
      const resData = await ajax({
        url: INTERCEPT_INITTRANSFORMREQUESTFN
      })
      expect(resData.token).to.be.equal(TOKEN.ONE)
  
      // 验证单个 token
      const resDataTwo = await ajax({
        url: INTERCEPT_INITTRANSFORMREQUESTFN,
        config: {
          transformRequestFn(config) {
            config.headers.common.token = TOKEN.TWO
            return config
          }
        }
      })
      expect(resDataTwo.token).to.be.equal(TOKEN.TWO)
  
    })
  
    it(`transformRequestFn`, async function () {
      const TOKEN = {   // token 标识
        ONE: 'one',
        TWO: 'two'
      }
      const ajax = ajaxInt()
      
      // 验证单个 token
      const resDataTwo = await ajax({
        url: INTERCEPT_INITTRANSFORMREQUESTFN,
        config: {
          transformRequestFn(config) {
            config.headers.common.token = TOKEN.TWO
            return config
          }
        }
      })
      expect(resDataTwo.token).to.be.equal(TOKEN.TWO)
  
    })
  })

  describe('get 参数拦截', function () {
    it(`initTransformParams`, async function () {
      const PARAMS = {   // get 参数
        ONE: 'one',
        TWO: 'two'
      }
      const ajax = ajaxInt({
        initTransformParams (data) {
          return Object.assign({
            name: PARAMS.ONE
          }, data)
        }
      })
      
      // 验证全局参数处理
      const resData = await ajax({
        url: INTERCEPT_INITTRANSFORMPARAMS,
        method: 'get'
      })
      expect(resData.name).to.be.equal(PARAMS.ONE)
  
      // 验证单个参数处理
      const resDataTwo = await ajax({
        url: INTERCEPT_INITTRANSFORMPARAMS,
        method: 'get',
        transformParams(data) {
          return Object.assign({
            name: PARAMS.TWO
          }, data)
        }
      })
      expect(resDataTwo.name).to.be.equal(PARAMS.TWO)
  
    })
  
    it(`transformRequestFn`, async function () {
      const PARAMS = {   // get 参数
        ONE: 'one',
        TWO: 'two'
      }
      const ajax = ajaxInt()
      
      // 验证单个 token
      const resDataTwo = await ajax({
        url: INTERCEPT_INITTRANSFORMPARAMS,
        method: 'get',
        transformParams(data) {
          return Object.assign({
            name: PARAMS.TWO
          }, data)
        }
      })
      expect(resDataTwo.name).to.be.equal(PARAMS.TWO)
  
    })
  })

  describe('post 参数拦截', function () {
    it(`initTransformData`, async function () {
      const DATA = {   // get 参数
        ONE: 'one',
        TWO: 'two'
      }
      const ajax = ajaxInt({
        initTransformData (data) {
          return Object.assign({
            name: DATA.ONE
          }, data)
        }
      })
      
      // 验证全局参数处理
      const resData = await ajax({
        url: INTERCEPT_INITTRANSFORMDATA,
      })
      expect(resData.name).to.be.equal(DATA.ONE)
  
      // 验证单个参数处理
      const resDataTwo = await ajax({
        url: INTERCEPT_INITTRANSFORMDATA,
        transformData(data) {
          return Object.assign({
            name: DATA.TWO
          }, data)
        }
      })
      expect(resDataTwo.name).to.be.equal(DATA.TWO)
  
    })
  
    it(`transformRequestFn`, async function () {
      const DATA = {   // get 参数
        ONE: 'one',
        TWO: 'two'
      }
      const ajax = ajaxInt()
      
      // 验证单个 token
      const resDataTwo = await ajax({
        url: INTERCEPT_INITTRANSFORMDATA,
        transformData(data) {
          return Object.assign({
            name: DATA.TWO
          }, data)
        }
      })
      expect(resDataTwo.name).to.be.equal(DATA.TWO)
  
    })
  })

  describe('错误拦截', function () {
    it(`initTransformResponseErrorFn`, async function () {
      const STATUS = {   // 状态
        ERROR: 'error',
        NO_ERROR: 'no_error'
      }
      let STATUS_MESSAGE
      const ajax = ajaxInt({
        initTransformResponseErrorFn() {
          STATUS_MESSAGE = STATUS.ERROR
        }
      })
      
      // 失败请求
      await ajax({
        url: INTERCEPT_INITTRANSFORMRESPONSEERRORFN,
      }).catch(() => {})
      expect(STATUS_MESSAGE).to.be.equal(STATUS.ERROR)
  
      // 成功请求
      await ajax({
        url: INTERCEPT_INITTRANSFORMDATA
      }).then(() => {
        STATUS_MESSAGE = STATUS.NO_ERROR
      })
      expect(STATUS_MESSAGE).to.be.equal(STATUS.NO_ERROR)
  
    })
  })

  


})

after(function () {
  child.kill()
})