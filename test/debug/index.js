const ajaxInt = require('../../dist').default()
const path = require('path')
const fs = require('fs')
const FormData = require('form-data')
const axios = require('axios')

const ajax = ajaxInt()

async function a() {
  const file = await fs.createReadStream(path.join(__dirname, '../data/test.jpg'))
  console.log(file)
  const data = new FormData()
  data.append('file', file)

  // console.log(data)
  // console.log(data.getHeaders())
  let resData = await ajax({
    url: 'http://localhost:3100/upload',
    upload: true,
    data,
    config: {
      headers: {
        ...data.getHeaders()
      }
    }
  }).catch(err => {
    console.log('err')
  })
  console.log(resData)


  // axios.post('http://localhost:3100/upload', data, {
  //   headers: {
  //     ...data.getHeaders()
  //   }
  // }).then(res => {
  //   console.log('z', res.data)
  // })
}

a()
