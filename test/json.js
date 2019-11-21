const expect = require('chai').expect
const childProcess = require('child_process')
const path = require('path')
const fs = require('fs')
const util = require('util')
const FormData = require('form-data')
const readFile = util.promisify(fs.readFile)



const ajaxInt = require('../dist/index').default
const ajax = ajaxInt()
const { 
  JSON_GET, 
  JSON_POST,
  UPLOAD
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

describe('Content-Type 为 application/json 的请求', function () {
  let data = {
    name: 'sea'
  }
  it(`get`, async function () {
    let resData = await ajax({
      url: JSON_GET,
      type: 'get',
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })
  it(`get 简写ajax.get()`, async function () {
    let resData = await ajax.get({
      url: JSON_GET,
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })
  it(`post`, async function () {
    let resData = await ajax({
      url: JSON_POST,
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })
  it(`post 简写ajax.post()`, async function () {
    let resData = await ajax.post({
      url: JSON_POST,
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })
  it(`upload`, async function () {
    const file = await readFile(path.join(__dirname, './data/test.jpg'))
    const data = new FormData()
    data.append('file', file)
    let resData = await ajax({
      url: UPLOAD,
      upload: true,
      data
    })
    expect(data.name).to.be.equal(resData.name)
  })


})

after(function () {
  child.kill()
})


