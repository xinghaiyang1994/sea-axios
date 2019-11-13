import axios from 'axios'

let initTransformData, initTransformParams, initJson, initCookie, initDebug, initConfig

function createJsonHeader () {
    return {
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

function json2url (obj) {
    let arr = []
    for (let key in obj) {
        arr.push(`${key}=${encodeURIComponent(obj[key])}`)
    }
    return arr.join('&')
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

    const url = ajaxOptions.url
    const method = ajaxOptions.method || ajaxOptions.type || 'post'

    let timeBegin, data, withCredentials, dataType, transformRequest, debug

    // 是否携带 cookie
    if (typeof ajaxOptions.cookie !== 'undefined') {
        withCredentials = ajaxOptions.cookie
    } else {
        withCredentials = initCookie
    }

     // 上传文件
    if (ajaxOptions.upload) {
        const { config } = ajaxOptions
        data = ajaxOptions.data
        return axios.post(url, data, {
            ...config,
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

    // 是否按 application/json 处理 body
    if (initJson) {
        transformRequest = []
    } else {
        transformRequest = [json2url]
    }
    if (typeof ajaxOptions.json === 'boolean') {
        transformRequest = ajaxOptions.json ? [] : [json2url]
    }

    let config = {
        url,
        method,
        [dataType]: data,
        transformRequest,
        withCredentials,
    }

    // axios 扩展
    if (typeof ajaxOptions.json === 'boolean') {
        if (ajaxOptions.json) {
            config = Object.assign({}, initConfig, config, createJsonHeader(), ajaxOptions.config)
        } else {
            let tmpInitConfig = Object.assign({}, initConfig)
            if (tmpInitConfig.headers && tmpInitConfig.headers['Content-Type'] === 'application/json') {
                tmpInitConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            config = Object.assign({}, tmpInitConfig, config, ajaxOptions.config)
        }
    } else {
        config = Object.assign({}, initConfig, config, ajaxOptions.config)
    }
    // console.log('config', config)
    
    // 开启 debug
    if (typeof initDebug === 'boolean') {
        debug = initDebug
    }
    if (typeof ajaxOptions.debug === 'boolean') {
        debug = ajaxOptions.debug
    }
    if (debug) {
        timeBegin = Date.now()
    }

    return axios(config).then(res => {
        if (debug) {
            console.log(`请求${url} 用时:${Date.now() - timeBegin}ms`, res)
        }
        return res.status === 200 ? res.data : console.log(res)
    })

}

// 表单方式 get 的快捷方式
ajax.get = options => {
    options = Object.assign({}, options, {
        type: 'get',
        json: false
    })
    return ajax(options)
}

// application/json 的 post 的快捷方式
ajax.post = options => {
    options = Object.assign({}, options, {
        type: 'post',
        json: true
    })
    return ajax(options)
}

// 上传文件的 post 方式的快捷方式
ajax.upload = options => {
    options = Object.assign({}, options, {
        type: 'post',
        upload: true
    })
    return ajax(options)
}

function ajaxInit (initOptions = {}) {
    initTransformData = initOptions.initTransformData       // 全局 post 请求 data 处理函数
    initTransformParams = initOptions.initTransformParams   // 全局 get 请求 data 处理函数
    initCookie = typeof initOptions.initCookie === 'undefined' ? true : initOptions.initCookie  // 全局设置是否带 cookie
    initJson = typeof initOptions.initJson === 'undefined' ? true : initOptions.initJson        // 全局设置按 application/json 方法请求
    initDebug = initOptions.initDebug                       // 全局设置是否开启 debug
    
    // 全局 axios 扩展
    if (initJson) {
        initConfig = Object.assign({}, createJsonHeader(), initOptions.initConfig)
    } else {
        initConfig = Object.assign({}, initOptions.initConfig)
    }
    // console.log('initJson', initConfig)

    // 请求发送前统一拦截
    axios.interceptors.request.use(config => {
        if (config.config && config.config.transformRequestFn) {
            // 单个请求发送前拦截
            config.config.transformRequestFn && config.config.transformRequestFn(config)
        } else {
            // 全部请求发送前拦截
            initOptions.initTransformRequestFn && initOptions.initTransformRequestFn(config)
        }
        return config
    }, err => {
        // 全部请求发送前错误拦截
        initOptions.initTransformRequestErrorFn && initOptions.initTransformRequestErrorFn(err)
        return Promise.reject(err)
    })

    // 响应统一拦截
    axios.interceptors.response.use(res => {
        if (res.config && res.config.transformResponseFn) {
            // 单个响应拦截
            res.config.transformResponseFn && res.config.transformResponseFn(res)
        } else {
            // 全部响应拦截
            initOptions.initTransformResponseFn && initOptions.initTransformResponseFn(res)
        }
        return res
    }, err => {
        // 全部响应错误拦截
        initOptions.initTransformResponseErrorFn && initOptions.initTransformResponseErrorFn(err)
        return Promise.reject(err)
    })

    return ajax
}

export default ajaxInit