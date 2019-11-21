// const expect = require('chai').expect
// const childProcess = require('child_process')
// const path = require('path')
// const ajaxInt = require('../dist/index').default
// const ajax = ajaxInt()
// const { FORM_GET } = require('./config/api')

// let child

// before(async function () {
//   child = await childProcess.exec(`node ${path.join(__dirname, './server/app.js')}`)
//   await new Promise(function (resolve, reject) {
//     setTimeout(() => {
//       resolve()
//     }, 500)
//   })
// })

// describe('Content-Type 为 application/x-www-form-urlencoded 的请求', function () {
//   let data = {
//     name: 'sea'
//   }
//   it(`get`, async function () {
//     let resData = await ajax({
//       url: FORM_GET,
//       type: 'get',
//       data
//     })
//     expect(data.name).to.be.equal(resData.name)
//   })
//   it(`get 简写ajax.get()`, async function () {
//     let resData = await ajax.get({
//       url: FORM_GET,
//       data
//     })
//     expect(data.name).to.be.equal(resData.name)
//   })
// })

// after(function () {
//   child.kill()
// })