const expect = require('chai').expect
const childProcess = require('child_process')
const path = require('path')
const ajaxInt = require('../dist/index').default
const ajax = ajaxInt()

let child

before(async function () {
  child = await childProcess.exec(`node ${path.join(__dirname, './server/app.js')}`)
  await new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve()
    }, 500)
  })
})

describe('get 请求', function () {
  let data = {
    name: 'sea'
  }
  it(`/ ${JSON.stringify(data)}`, async function () {
    let resData = await ajax({
      url: 'http://localhost:3100',
      type: 'get',
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })
  it(`简写 / ${JSON.stringify(data)}`, async function () {
    let resData = await ajax.get({
      url: 'http://localhost:3100',
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })
})

after(function () {
  child.kill()
})