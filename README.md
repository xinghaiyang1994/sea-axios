# sea-axios

## 初始化配置说明
```js
import ajaxInit from 'sea-axios'  

let ajax = ajaxInit(options)
```
options 参数说明（都为非必填）
* initTransformData  
    类型：Function  
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
    说明：所有请求是否携带 cookie 。
* initConfig  
    类型：Object  
    说明：提供全局 axios 扩展，可以配置官方 axios(option) 配置。
* transformRequestFn  
    类型：Function  
    说明：全局请求发送前统一拦截。
    ```js
    ajaxInit({
        transformRequestFn (config) {        // config 为 axios 请求信息
        
            // 统一在请求前处理
            
            return config  // 必须有返回值
        }
    })
    ```
* transformResponseFn  
    类型：Function  
    说明：全局响应后统一拦截。
    ```js
    ajaxInit({
        transformResponseFn (res) {        // res 为 axios 返回信息
        
            // 统一在返回后处理
            
            return res  // 必须有返回值
        }
    })
    ```
## ajax 使用
```js
ajax(url, options)
// 或者          
ajax(options)  
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
## 常用
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

// post 请求
function getOne (data) {
    return ajax({
        url: '//a.com',
        type: 'post'
        data
    })
}

// 上传文件
function getOne (data) {
    return ajax({
        url: '//a.com',
        upload: true,
        data
    })
}

// 发送 json 格式，详情头为 application/json 的请求
function getOne (data) {
    return ajax({
        url: '//a.com',
        type: 'post',
        json: true,
        config: {
            headers: {
                'Content-Type': 'application/json'
            } 
        },
        data
    })
}
```