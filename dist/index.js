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

var initTransformData, initTransformParams, initJson, initCookie, initDebug, initConfig;

function createJsonHeader() {
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

function json2url(obj) {
  var arr = [];

  for (var key in obj) {
    arr.push("".concat(key, "=").concat(encodeURIComponent(obj[key])));
  }

  return arr.join('&');
}

function tranErrorDefault(err) {
  return Promise.reject(err);
}

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
  var method = ajaxOptions.method || ajaxOptions.type || 'post';
  var timeBegin, data, withCredentials, dataType, transformRequest, debug; // 是否携带 cookie

  if (typeof ajaxOptions.cookie !== 'undefined') {
    withCredentials = ajaxOptions.cookie;
  } else {
    withCredentials = initCookie;
  } // 上传文件


  if (ajaxOptions.upload) {
    var _ajaxOptions = ajaxOptions,
        _config = _ajaxOptions.config;
    data = ajaxOptions.data;
    return _axios["default"].post(url, data, _objectSpread({}, _config, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: withCredentials
    })).then(function (res) {
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

  if (typeof ajaxOptions.json === 'boolean') {
    if (ajaxOptions.json) {
      config = Object.assign({}, initConfig, config, createJsonHeader(), ajaxOptions.config);
    } else {
      var tmpInitConfig = Object.assign({}, initConfig);

      if (tmpInitConfig.headers && tmpInitConfig.headers['Content-Type'] === 'application/json') {
        tmpInitConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }

      config = Object.assign({}, tmpInitConfig, config, ajaxOptions.config);
    }
  } else {
    config = Object.assign({}, initConfig, config, ajaxOptions.config);
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
  options = Object.assign({}, options, {
    type: 'get',
    json: false
  });
  return ajax(options);
}; // application/json 的 post 的快捷方式


ajax.post = function (options) {
  options = Object.assign({}, options, {
    type: 'post',
    json: true
  });
  return ajax(options);
}; // 上传文件的 post 方式的快捷方式


ajax.upload = function (options) {
  options = Object.assign({}, options, {
    type: 'post',
    upload: true
  });
  return ajax(options);
};

function ajaxInit() {
  var initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initTransformData = initOptions.initTransformData; // 全局 post 请求 data 处理函数

  initTransformParams = initOptions.initTransformParams; // 全局 get 请求 data 处理函数

  initCookie = typeof initOptions.initCookie === 'undefined' ? true : initOptions.initCookie; // 全局设置是否带 cookie

  initJson = typeof initOptions.initJson === 'undefined' ? true : initOptions.initJson; // 全局设置按 application/json 方法请求

  initDebug = initOptions.initDebug; // 全局设置是否开启 debug
  // 全局 axios 扩展

  if (initJson) {
    initConfig = Object.assign({}, createJsonHeader(), initOptions.initConfig);
  } else {
    initConfig = Object.assign({}, initOptions.initConfig);
  } // console.log('initJson', initConfig)
  // 请求发送前统一拦截


  _axios["default"].interceptors.request.use(function (config) {
    if (config.config && config.config.transformRequestFn) {
      // 单个请求发送前拦截
      config.config.transformRequestFn && config.config.transformRequestFn(config);
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

var _default = ajaxInit;
exports["default"] = _default;
