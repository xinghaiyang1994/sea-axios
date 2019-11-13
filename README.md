# sea-axios
sea-axios (v2.0.0以上) 是为了简化使用，基于 axios (v0.18.0) 封装的一套 http 工具库。

功能
* 简化一些常用请求方式的封装。
* 提供基于全局的请求配置项。
* 开启 debug 可以显示请求响应耗时。
* 提供 axios 原生配置项扩展。

注意
* sea-axios v2.0.0 不兼容 sea-axios v1.0.0 版本。

版本说明
* 2.0.1  
  修复上传文件不能单独设置拦截的情况。

## 安装
```shell
npm i sea-axios -S
```

## 使用前约定
sea-axios 会暴露一个 ajaxInit 方法用于全局配置。ajaxInit 会返回一个 ajax 方法用于单个请求配置。ajaxInit、ajax 都提供 自身配置和 axios 的原生扩展。

配置项优先级遵从以下顺序，优先级高的会覆盖优先级低的配置项：
```
ajax 的 axios 扩展 > ajax 的自身配置 > ajaxInit 的 axios 扩展 > ajaxInit 的自身设置
```

ajaxInit 的配置项多以 init 开头，ajax 没有 init 开头。ajaxInit 配置项名称与 ajax 配置项名称相似(一个以 init 开头，一个没有 init )，功能也相似，区别是 ajaxInit 作用域所有 ajax 方法，ajax 只作用于单个 ajax 方法。

## 快速上手
上手前需要与后端确定接口的 `Content-Type`，ajaxInit 默认按 `Content-Type: application/json` 方式进行请求，默认携带 cookie 。

### 根据不同 `Content-Type` 进行配置
* `Content-Type: application/json`
    ```js
    import ajaxInit from 'sea-axios'
    let ajax = ajaxInit()   
    
    // get 请求
    function getOne (data) {
        return ajax({
            url: '//a.com',
            data
        })
    }
    
    // get 请求的另一种方式
    function getOne (data) {
        return ajax.get({
            url: '//a.com',
            data
        })
    }
    
    // post 请求
    function postTwo (data) {
        return ajax({
            url: '//a.com',
            type: 'post',
            data
        })
    }
    
    // post 请求的另一种方式
    function postTwo (data) {
        return ajax.post({
            url: '//a.com',
            data
        })
    }
    
    // 上传文件
    function postUpload (data) {
        return ajax({
            url: '//a.com',
            upload: true,
            data
        })
    }
    
    // 上传文件的另一种方式
    function postUpload (data) {
        return ajax.upload({
            url: '//a.com',
            data
        })
    }
    
    export {
        getOne,
        postTwo,
        postUpload
    }
    ```
* `Content-Type: application/x-www-form-urlencoded` 也就是正常表单方式的提交
    ```js
    import ajaxInit from 'sea-axios'
    let ajax = ajaxInit({
        initJson: false
    })
    
    // get 请求
    function getOne (data) {
        return ajax({
            url: '//a.com',
            data
        })
    }
    
    // get 请求的另一种方式
    function getOne (data) {
        return ajax.get({
            url: '//a.com',
            data
        })
    }
    
    // post 请求
    function postTwo (data) {
        return ajax({
            url: '//a.com',
            type: 'post',
            data
        })
    }
    
    // 上传文件
    function postUpload (data) {
        return ajax({
            url: '//a.com',
            upload: true,
            data
        })
    }
    
    // 上传文件的另一种方式
    function postUpload (data) {
        return ajax.upload({
            url: '//a.com',
            data
        })
    }
    
    export {
        getOne,
        postTwo,
        postUpload
    }
    ```

### 全局请求前、响应后拦截
ajaxInit 配置 initTransformRequestFn可以实现请求前统一处理， initTransformResponseFn 可以实现响应后统一拦截。如果个别单个接口不需要走请求前或响应后统一拦截，可在单个不需要的 ajax 中配置 transformRequestFn 或 transformResponseFn 。

开发过程中可能有如下场景
* 对未登录状态进行拦截跳转到登录页
    ```js
    // 如约定 code 码返回为 -1 表示未登录
    import ajaxInit from 'sea-axios'
    let ajax = ajaxInit({
        initTransformResponseFn (res) {
            if (res.status === 200 && res.data.code === -1) {
                window.location.href = '登录页 url'
            }
            return res
        }
    })
    ```

### 全局 get 或 post 参数进行预处理
开发过程中可能有如下场景
* 所有的 post 请求参数外边包一层 params
    ```js
    import ajaxInit from 'sea-axios'
    let ajax = ajaxInit({
        initTransformData (data) {
            return {
                params: JSON.stringify(data)
            }
        }
    })
    
    // get 请求
    function getOne (data) {
        return ajax({
            url: '//a.com',
            data
        })
    }
    // 如调用 getOne({name: 1}) 则实际请求参数为 {params: '{name: 1}'}
    ```
* 所有的 get 请求参数外边包一层 params  
    将上面中的 initTransformData 换成 initTransformParams 即可。

### 上传文件
在单个文件中配置 upload 为 true 即可。该配置默认按 post 方式上传文件。
```
// 上传文件
function postUpload (data) {
    return ajax({
        url: '//a.com',
        upload: true,
        data
    })
}
```

### cookie  
全局默认所有请求都携带 cookie ,如果想单个请求不携带 cookie ,则需要将 ajax 的 cookie 设置为 false 。


如果不需要全局携带 cookie ，可以将 ajaxInit 的 initCookie 设置为 false ，如果又想某个请求携带 cookie ，则需要将 ajax 的 cookie 设置为 true 。

### 全局 axios 扩展与单个 axios 扩展
ajaxInit 的 initConfig 与 ajax 的 config 可以实现 axios 原生的一些扩展配置。配置参考 https://www.npmjs.com/package/axios#request-config 中的 Request Config 部分。

### debug 
ajaxInit 的 initDebug 为 true 可在浏览器控制台显示所有请求响应耗时。ajax 的 debug 为 true 可实现单个上述功能。

## API
### ajaxInit 相关
```js
import ajaxInit from 'sea-axios'  

let ajax = ajaxInit(options)
```
options 参数说明（都为非必填）
* initTransformData  
    类型：Function  
    默认值：`function (data) { return data }`  
    说明：所有 post 请求前对参数进行处理。
    ```js
    ajaxInit({
        initTransformData (data) {      // data 是请求的数据
        
            // 统一处理请求数据
            
            return data     // 必须有返回值
        }
    })
    ```
* initTransformParams  
    类型：Function  
    默认值：`function (data) { return data }`  
    说明：所有 get 请求前对参数进行处理。
    ```js
    ajaxInit({
        initTransformParams (data) {      // data 是请求的数据
        
            // 统一处理请求数据
            
            return data     // 必须有返回值
        }
    })
    ```
* initCookie  
    类型：Boolean  
    默认值：true    
    说明：所有请求是否携带 cookie 。
* initJson  
    类型：Boolean  
    默认值：true    
    说明：请求按 `Content-Type: application/json` 方法请求，请求方法为 post 。
* initDebug  
    类型：Boolean  
    默认值：false   
    说明：所有请求是否开启 debug 。
* initConfig  
    类型：Object  
    默认值：{}   
    说明：提供全局 axios 扩展，可以配置官方 axios(option) 配置。
* initTransformRequestFn  
    类型：Function  
    默认值：`function (config) { return config }`   
    说明：全局请求发送前统一拦截。
    ```js
    ajaxInit({
        initTransformRequestFn (config) {        // config 为 axios 请求信息
        
            // 统一在请求前处理
            
            return config  // 必须有返回值
        }
    })
    ```
* initTransformResponseFn  
    类型：Function  
    默认值：`function (res) { return res }`   
    说明：全局响应后统一拦截。
    ```js
    ajaxInit({
        initTransformResponseFn (res) {        // res 为 axios 返回信息
        
            // 统一在返回后处理
            
            return res  // 必须有返回值
        }
    })
    ```
* initTransformRequestErrorFn  
    类型：Function  
    默认值：`function (err) {}`   
    说明：全部请求发送前错误拦截。
    ```js
    ajaxInit({
        initTransformRequestErrorFn (err) {        // err 为错误信息
        
            // 统一全部请求发送前错误拦截
      
        }
    })
    ```  
* initTransformResponseErrorFn  
    类型：Function  
    默认值：`function (err) {}`   
    说明：全部响应错误拦截。
    ```js
    ajaxInit({
        initTransformResponseErrorFn (err) {        // err 为错误信息
        
            // 统一全部响应错误拦截
      
        }
    })
    ``` 
## ajax 相关
```js
ajax(url, options)
// 或者          
ajax(options)  

// 表单方式 get 的快捷方式
ajax.get(options)

// pplication/json 的 post 的快捷方式
ajax.get(options)

// 上传文件的 post 方式的快捷方式
ajax.upload(options)
```
options 参数说明（只有 url 是必填，其他都是非必填。所有参数都可以覆盖初始化请求的全局配置参数）
* url  
    类型：String  
    说明：请求的 url 。
* method 或者 type  
    类型：String  
    说明：请求类型，默认是 get 方法。
* cookie  
    类型：Boolean  
    说明：是否携带 cookie
* upload  
    类型：Boolean  
    说明：是否上传文件，上传文件是 post 请求。
* data  
    类型：Any  
    说明：请求时发送的参数。get 、post 请求发送的数据都是 data 。
* json  
    类型：Boolean  
    说明：请求数据是否为 json 格式。
* transformData  
    类型：Function  
    说明：单个 post 请求前对参数进行处理。
* transformParams  
    类型：Function  
    说明：单个 get 请求前对参数进行处理。
* debug   
    类型：Boolean      
    说明：是否开启 debug 模式，开启后打印请求响应时间。
* config  
    类型：Object  
    说明：提供 axios 扩展，可以配置官方 axios(option) 配置。除此之外该参数还有一些其他函数。
    * transformRequestFn  
        类型：Function   
        说明：单个请求发送前拦截。
    * transformResponseFn  
        类型：Function   
        说明：单个响应拦截。

## ts 相关
配置下 tsconfig.json 中的 paths 和 baseUrl 字段。
```js
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "*": ["types/*"]
    }
  }
}
```

根目录配置 types/sea-axios/index.d.ts
```ts
declare module 'dj-axios' {
  type ajax = (config: object) => Promise<any>
  export default function (config: object): ajax
}
```