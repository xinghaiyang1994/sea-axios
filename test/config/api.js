// 前端使用路径
const { DOMAIN } = require('./index')
const PATH = require('./path')

const API = {}

for (let key in PATH) {
  API[key] = `${DOMAIN}${PATH[key]}`
}

module.exports = API