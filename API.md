# apk上传管理平台 接口文档
```

baseUrl: http://172.28.4.46:3001

```
## 除了登陆不需要token外，其他接口均需token

## 目录：

[1、登陆](#1、登陆)<br/>
[2、获取预约列表](#2、获取预约列表)<br/>
[3、预约版本](#3、预约版本)<br/>
[4、上传apk](#4、上传apk)<br/>
[5、绑定apk包](#5、绑定apk包)<br/>
[6、订单操作](#6、订单操作)<br/>
[7、下载操作](#7、下载操作)<br/>



## 接口列表：

### 1、登陆

#### 请求URL:  
```
http://172.28.4.46:3001/admin/login
```

#### 示例：

#### 请求方式: 
```
POST
```

#### 参数类型：query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|account      |Y       |string  |账号   |
|psw      |Y       |string  |密码 两重md5   |

#### 返回示例：

```javascript
{
  code: 200
  msg: "ok"
  res: {
    account: "560999"
    manager: 0
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiNTYwOTk5IiwicHN3IjoiNzA4NzNlODU4MGM5OTAwOTg2OTM5NjExNjE4ZDdiMWUiLCJwbGF0Zm9ybVR5cGUiOiJhcGtNYW5hZ2VyIiwiZXhwIjoxNTk5NTQyNDkwMTY4LCJpYXQiOjE1OTk1MzUyOTB9.t-AXqnu5s5tHKZbqwOXEbk4txOle3t-NTaLT_N_v9nE"
    userId: 574236
    userName: "测试"
    _id: "5f56f86bed6f598cd89335da"
  }
}
```

### 2、获取预约列表

#### 请求URL：
```
http://172.28.4.46:3001/orderList/getList
```

#### 示例：
[http://172.28.4.46:3001/orderList/getList?page=1&limit=10](http://172.28.4.46:3001/orderList/getList?page=1&limit=10)

#### 请求方式：
```
GET
```

#### 参数类型：param

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|page      |N       |int   |页码 |
|limit      |N      |int   |每页限制 要么都传要么都不传，不传默认page = 1, limit = 10|

#### 返回示例：
```javascript
{
  code: 200
  msg: "ok"
  res: {
    limit: 10,
    page: 1,
    total: 23,
    total_pages: 3,
    data: [...]
  }
}
```


### 3、预约版本

#### 请求URL：
```
http://172.28.4.46:3001/orderList/appointment
```

#### 示例：


#### 请求方式：
```
POST
```

#### query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|userId      |Y      |int   |使用者userId|
|version      |Y      |Sting   |预约版本|
|userId      |Y       |int   |平台 0: '格力+', 1: 'GREE+' |

#### 返回示例：
```javascript
{  
  code: 200 ,
  msg: 'ok',
  res: {
    userId: 10000,
    createTime: 1595818787325, // 生成时间
    overTime: 1595821787325, // 超期时间
    finishTime: null,  // 
    orderStatus: 1, // 状态 
    platformType： 0, // 平台
    version: '1.1.1.1.1',
    url: null,
    checkerId: null,
    orderId: 1
  }
}
```

### 4、上传apk

#### 请求URL：
```
http://172.28.4.46:3001/orderList/uploadApk
```

#### 示例：

#### 请求方式：
```
POST
```

#### query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|files      |Y      |binary   |apk文件|


#### 返回示例：
```javascript
 {  
  code: 200 ,
  msg: 'ok',
  res: {
   url: url, // 文件路径
   size: size // 文件大小
  }
}
```

### 5、绑定apk包

#### 请求URL：
```
http://172.28.4.46:3001/orderList/uploadApk
```

#### 示例：


#### 请求方式：
```
POST
```

#### query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|userId      |Y      |int   |使用者userId|
|url      |Y      |String   |文件路径|
|version      |Y      |String   |预约版本|
|platformType      |Y       |int   |平台 0: '格力+', 1: 'GREE+' |
|describe      |Y      |String   |描述|
|buildName      |Y      |String   |buildName 格式: 用途+上传人姓名|


#### 返回示例：
```javascript
{  
  code: 200 ,
  msg: 'ok',
  res: {
    uploadTime: 绑定时间,
    overTime： 绑定时间+ 3天,
    orderStatus: 3,
    url: 文件路径
  }
}
```


### 6、订单操作

#### 请求URL：
```
http://172.28.4.46:3001/orderList/operationOrder
```

#### 示例：


#### 请求方式：
```
POST
```

#### query

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|userId      |Y      |int   |使用者userId|
|orderId      |Y      |int   |预约单号|
|operationType      |Y      |String   |操作类型 1 : 同意, 2: 驳回, 3: 删除|


#### 返回示例：
```javascript
{  
  code: 200 ,
  msg: 'ok',
  res: {}
}
```

### 7、下载操作

#### 请求URL：
```
http://172.28.4.46:3001/orderList/downloadApk
```

#### 示例：

#### 请求方式：
```
GET
```

#### param

|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|url      |Y      |String   |文件路径|


