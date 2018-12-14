'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initTransformData = void 0,
    initTransformParams = void 0,
    initCookie = void 0,
    initConfig = void 0;

function json2url(data) {
    var str = '';
    for (var name in data) {
        str += '&' + name + '=' + encodeURIComponent(data[name]);
    }
    if (str !== '') {
        str = str.slice(1);
    }
    return str;
}

function tranErrorDefault(err) {
    return Promise.reject(err);
}

function ajax() {
    var _config;

    var ajaxOptions = void 0;

    // url 为首参处理
    if (typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
        ajaxOptions = Object.assign({
            url: arguments.length <= 0 ? undefined : arguments[0]
        }, arguments.length <= 1 ? undefined : arguments[1]);
    } else {
        ajaxOptions = arguments.length <= 0 ? undefined : arguments[0];
    }

    if (!ajaxOptions.url) {
        return console.log('请输入 url !');
    }

    var url = ajaxOptions.url,
        method = ajaxOptions.method || ajaxOptions.type || 'get',
        debug = ajaxOptions.debug,
        transformRequest = ajaxOptions.json ? [] : [json2url];

    var timeBegin = void 0,
        data = void 0,
        withCredentials = void 0,
        dataType = void 0;

    if (typeof ajaxOptions.cookie !== 'undefined') {
        withCredentials = ajaxOptions.cookie;
    } else {
        withCredentials = initCookie;
    }

    // 上传文件
    if (ajaxOptions.upload) {
        data = ajaxOptions.data;
        return _axios2.default.post(url, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: withCredentials
        }).then(function (res) {
            return res.status === 200 ? res.data : console.log(res);
        });
    }

    if (method.toLowerCase() === 'get') {
        dataType = 'params';
        if (ajaxOptions.transformParams) {
            data = ajaxOptions.transformParams(ajaxOptions.data);
        } else if (initTransformParams) {
            data = initTransformParams(ajaxOptions.data);
        } else {
            data = ajaxOptions.data;
        }
    } else {
        dataType = 'data';
        if (ajaxOptions.transformData) {
            data = ajaxOptions.transformData(ajaxOptions.data);
        } else if (initTransformData) {
            data = initTransformData(ajaxOptions.data);
        } else {
            data = ajaxOptions.data;
        }
    }

    var config = (_config = {
        url: url,
        method: method
    }, _defineProperty(_config, dataType, data), _defineProperty(_config, 'transformRequest', transformRequest), _defineProperty(_config, 'withCredentials', withCredentials), _config);

    // 配置扩展
    config = Object.assign(config, initConfig, ajaxOptions.config);

    // 开启 debug
    if (debug) {
        timeBegin = Date.now();
    }

    return (0, _axios2.default)(config).then(function (res) {
        if (debug) {
            console.log(url, Date.now() - timeBegin + 'ms', res);
        }
        return res.status === 200 ? res.data : console.log(res);
    });
}

function ajaxInit() {
    var initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    initTransformData = initOptions.initTransformData; // 全局 post 请求 data 处理函数
    initTransformParams = initOptions.initTransformParams; // 全局 get 请求 data 处理函数
    initCookie = initOptions.initCookie; // 全局设置是否带 cookie
    initConfig = initOptions.initConfig; // 全局配置

    // 请求发送前统一拦截
    _axios2.default.interceptors.request.use(function (config) {
        if (config.config && config.config.transformRequestFn) {
            // 单个请求发送前拦截
            config.config.transformRequestFn && config.config.transformRequestFn(config);
        } else {
            // 全部请求发送前拦截
            initOptions.transformRequestFn && initOptions.transformRequestFn(config);
        }

        return config;
    }, tranErrorDefault);

    // 响应统一拦截
    _axios2.default.interceptors.response.use(function (res) {

        if (res.config && res.config.transformResponseFn) {
            // 单个响应拦截
            res.config.transformResponseFn && res.config.transformResponseFn(res);
        } else {
            // 全部响应拦截
            initOptions.transformResponseFn && initOptions.transformResponseFn(res);
        }

        return res;
    }, tranErrorDefault);

    return ajax;
}

exports.default = ajaxInit;
