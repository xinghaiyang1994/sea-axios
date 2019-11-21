const ajaxInt = require('./dist/index').default
const path = require('path')
const fs = require('fs')
const util = require('util')
const FormData = require('form-data')
const readFile = util.promisify(fs.readFile)
const axios = require('axios')

const ajax = ajaxInt()

async function a() {
  const file = await fs.createReadStream(path.join(__dirname, './test/data/test.jpg'))
  const data = new FormData()
  data.append('file', file)
  // console.log(data)
  let resData = await ajax({
    url: 'http://localhost:3100/upload',
    upload: true,
    data
  })
  console.log(resData)
  // console.log(data)
  // axios.post('http://localhost:3100/upload', data, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // }).then(res => {
  //   console.log('z', res.data)
  // })
}
a()
