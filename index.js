import axios from 'axios'

let initTransformData, initTransformParams, initCookie, initConfig

function json2url (data) {
    let str = '' 
    for(let name in data){
        str += `&${name}=${encodeURIComponent(data[name])}`
    }
    if (str !== '') {
        str = str.slice(1)
    }
    return str
}

function tranErrorDefault (err) {
    return Promise.reject(err)
}

function ajax (...options) {
    let ajaxOptions 

    // url 为首参处理
    if (typeof options[0] === 'string') {
        ajaxOptions = Object.assign({
            url: options[0]
        }, options[1])
    } else {
        ajaxOptions = options[0]
    }

    if (!ajaxOptions.url) {
        return console.log('请输入 url !')
    }

    const url = ajaxOptions.url,
        method = ajaxOptions.method || ajaxOptions.type || 'get',
        debug = ajaxOptions.debug,
        transformRequest = ajaxOptions.json ? [] : [json2url]

    let timeBegin, data, withCredentials, dataType

    if (typeof ajaxOptions.cookie !== 'undefined') {
        withCredentials = ajaxOptions.cookie
    } else {
        withCredentials = initCookie
    }

     // 上传文件
     if (ajaxOptions.upload) {
        data = ajaxOptions.data
        return axios.post(url, data, {
            headers: {'Content-Type': 'multipart/form-data'},
            withCredentials
        }).then(res => {
            return res.status === 200 ? res.data : console.log(res)
        })
    }

    if (method.toLowerCase() === 'get') {
        dataType = 'params'
        if (ajaxOptions.transformParams) {
            data = ajaxOptions.transformParams(ajaxOptions.data)
        } else if (initTransformParams) {
            data = initTransformParams(ajaxOptions.data)
        } else {
            data = ajaxOptions.data
        }
    } else {
        dataType = 'data'
        if (ajaxOptions.transformData) {
            data = ajaxOptions.transformData(ajaxOptions.data)
        } else if (initTransformData) {
            data = initTransformData(ajaxOptions.data)
        } else {
            data = ajaxOptions.data
        }
    }

    let config = {
        url,
        method,
        [dataType]: data,
        transformRequest,
        withCredentials,
    }

    // 配置扩展
    config = Object.assign(config, initConfig, ajaxOptions.config)

    // 开启 debug
    if (debug) {
        timeBegin = Date.now()
    }

    return axios(config).then(res => {
        if (debug) {
            console.log(url, `${Date.now() - timeBegin}ms`, res)
        }
        return res.status === 200 ? res.data : console.log(res)
    })

}

function ajaxInit (initOptions = {}) {
    
    initTransformData = initOptions.initTransformData       // 全局 post 请求 data 处理函数
    initTransformParams = initOptions.initTransformParams   // 全局 get 请求 data 处理函数
    initCookie = initOptions.initCookie                     // 全局设置是否带 cookie
    initConfig = initOptions.initConfig                     // 全局配置
    
    // 请求发送前统一拦截
    axios.interceptors.request.use(config => {
        if (config.config && config.config.transformRequestFn) {
            // 单个请求发送前拦截
            config.config.transformRequestFn && config.config.transformRequestFn(config)
        } else {
            // 全部请求发送前拦截
            initOptions.transformRequestFn && initOptions.transformRequestFn(config)
        }

        return config

    }, tranErrorDefault)

    // 响应统一拦截
    axios.interceptors.response.use(res => {

        if (res.config && res.config.transformResponseFn) {
            // 单个响应拦截
            res.config.transformResponseFn && res.config.transformResponseFn(res)
        } else {
            // 全部响应拦截
            initOptions.transformResponseFn && initOptions.transformResponseFn(res)
        }

        return res

    }, tranErrorDefault)

    return ajax

}

export default ajaxInit