"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 拼成 url 参数格式
function json2url(obj) {
  var arr = [];

  for (var key in obj) {
    arr.push("".concat(key, "=").concat(encodeURIComponent(obj[key])));
  }

  return arr.join('&');
} // 深拷贝


function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

var fn = function fn() {
  var initTransformData, initTransformParams, initJson, initCookie, initDebug, initConfig; // json 请求的 header

  var jsonHeader = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  function ajax() {
    var _config2;

    var ajaxOptions; // url 为首参处理

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

    var url = ajaxOptions.url;
    var method = ajaxOptions.method || ajaxOptions.type || 'post'; // 默认 post

    var timeBegin, data, withCredentials, dataType, transformRequest, debug; // 是否携带 cookie

    if (typeof ajaxOptions.cookie !== 'undefined') {
      withCredentials = ajaxOptions.cookie;
    } else {
      withCredentials = initCookie;
    } // 上传文件


    if (ajaxOptions.upload) {
      var _ajaxOptions = ajaxOptions,
          _config = _ajaxOptions.config,
          _data = _ajaxOptions.data;
      return _axios["default"].post(url, _data, _objectSpread({
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: withCredentials
      }, _config)).then(function (res) {
        return res.status === 200 ? res.data : console.log(res);
      });
    }

    if (method.toLowerCase() === 'get') {
      // get 方式
      dataType = 'params';

      if (ajaxOptions.transformParams) {
        data = ajaxOptions.transformParams(ajaxOptions.data);
      } else if (initTransformParams) {
        data = initTransformParams(ajaxOptions.data);
      } else {
        data = ajaxOptions.data;
      }
    } else {
      // post 方式
      dataType = 'data';

      if (ajaxOptions.transformData) {
        data = ajaxOptions.transformData(ajaxOptions.data);
      } else if (initTransformData) {
        data = initTransformData(ajaxOptions.data);
      } else {
        data = ajaxOptions.data;
      }
    } // 是否按 application/json 处理 body


    if (initJson) {
      transformRequest = [];
    } else {
      transformRequest = [json2url];
    }

    if (typeof ajaxOptions.json === 'boolean') {
      transformRequest = ajaxOptions.json ? [] : [json2url];
    }

    var config = (_config2 = {
      url: url,
      method: method
    }, _defineProperty(_config2, dataType, data), _defineProperty(_config2, "transformRequest", transformRequest), _defineProperty(_config2, "withCredentials", withCredentials), _config2); // axios 扩展

    var newInitConfig = deepCopy(initConfig); // 防止 tmpInitConfig 的修改影响 initConfig

    if (typeof ajaxOptions.json === 'boolean') {
      if (ajaxOptions.json) {
        // json 方式设置 config ,依次合并全局 config、通用 config、json 头的 config、单个配置的 config
        config = Object.assign({}, newInitConfig, config, deepCopy(jsonHeader), ajaxOptions.config);
      } else {
        // 如果全局的 config 的 header 为 json 的 header ,则设置为表单的 header 
        if (newInitConfig.headers && newInitConfig.headers['Content-Type'] === 'application/json') {
          newInitConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } // 依次合并全局 config、通用 config、单个配置的 config


        config = Object.assign({}, newInitConfig, config, ajaxOptions.config);
      }
    } else {
      config = Object.assign({}, newInitConfig, config, ajaxOptions.config);
    } // console.log('config', config)
    // 开启 debug


    if (typeof initDebug === 'boolean') {
      debug = initDebug;
    }

    if (typeof ajaxOptions.debug === 'boolean') {
      debug = ajaxOptions.debug;
    }

    if (debug) {
      timeBegin = Date.now();
    }

    return (0, _axios["default"])(config).then(function (res) {
      if (debug) {
        console.log("\u8BF7\u6C42".concat(url, " \u7528\u65F6:").concat(Date.now() - timeBegin, "ms"), res);
      }

      return res.status === 200 ? res.data : console.log(res);
    });
  } // 表单方式 get 的快捷方式


  ajax.get = function (options) {
    options = Object.assign({
      type: 'get'
    }, options);
    return ajax(options);
  }; // application/json 的 post 的快捷方式


  ajax.post = function (options) {
    options = Object.assign({
      type: 'post'
    }, options);
    return ajax(options);
  }; // 上传文件的 post 方式的快捷方式


  ajax.upload = function (options) {
    options = Object.assign({}, options, {
      type: 'post',
      upload: true
    });
    return ajax(options);
  }; // 全局配置


  function ajaxInit() {
    var initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initTransformData = initOptions.initTransformData; // 全局 post 请求 data 处理函数

    initTransformParams = initOptions.initTransformParams; // 全局 get 请求 data 处理函数

    initCookie = typeof initOptions.initCookie === 'undefined' ? true : initOptions.initCookie; // 全局设置是否带 cookie , 默认带

    initJson = typeof initOptions.initJson === 'undefined' ? true : initOptions.initJson; // 全局设置是否按 application/json 方法请求, 默认为是

    initDebug = initOptions.initDebug; // 全局设置是否开启 debug
    // 全局 axios 扩展

    if (initJson) {
      initConfig = Object.assign({}, deepCopy(jsonHeader), initOptions.initConfig);
    } else {
      initConfig = Object.assign({}, initOptions.initConfig);
    } // console.log('initJson', initConfig)
    // 请求发送前统一拦截


    _axios["default"].interceptors.request.use(function (config) {
      if (config.transformRequestFn) {
        // 单个请求发送前拦截
        config.transformRequestFn && config.transformRequestFn(config);
      } else {
        // 全部请求发送前拦截
        initOptions.initTransformRequestFn && initOptions.initTransformRequestFn(config);
      }

      return config;
    }, function (err) {
      // 全部请求发送前错误拦截
      initOptions.initTransformRequestErrorFn && initOptions.initTransformRequestErrorFn(err);
      return Promise.reject(err);
    }); // 响应统一拦截


    _axios["default"].interceptors.response.use(function (res) {
      if (res.config && res.config.transformResponseFn) {
        // 单个响应拦截
        res.config.transformResponseFn && res.config.transformResponseFn(res);
      } else {
        // 全部响应拦截
        initOptions.initTransformResponseFn && initOptions.initTransformResponseFn(res);
      }

      return res;
    }, function (err) {
      // 全部响应错误拦截
      initOptions.initTransformResponseErrorFn && initOptions.initTransformResponseErrorFn(err);
      return Promise.reject(err);
    });

    return ajax;
  }

  return ajaxInit;
};

var _default = fn;
exports["default"] = _default;
