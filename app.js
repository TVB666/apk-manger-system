/*
 * @Descripttion: 启动后端
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-13 22:16:16
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-27 11:10:06
 */
var express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
var bodyParser = require('body-parser')
var dayjs = require('dayjs')

// 自定义log 带上时间输出
console.oldlog = console.log;
function log(){
  process.stdout.write('\n'+ dayjs().format('YYYY-MM-DD HH:mm:ss') + ': ');
  console.oldlog.apply(console, arguments);
 }
console.log = log;


global.dbHandel = require('./utils/dbHandle');
global.db = mongoose.connect("mongodb://localhost:27017/apkManagerSystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {console.log('数据库连接成功')})
  .catch(err => {console.error('数据库连接失败')})



//声明后端接口的访问路由
var app = express()
app.use(bodyParser.urlencoded({extended: false})) //解析表单数据需要用到的模块
app.use(bodyParser.json())
const getApkList = require('./router/getApkList') // 预约列表
const home = require('./router/home') // 彩蛋
const login = require('./router/login') // 登录
const orderVersion = require('./router/orderVersion') // 预约版本
const uploadApk = require('./router/uploadApk')  // 上传apk
const bindingApk = require('./router/bindingApk') // 绑定apk
const uploadPgyer = require('./router/uploadPgyer') // 上传蒲公英
const deleteOrder = require('./router/deleteOrder') //删除订单
const operationOrder = require('./router/operationOrder') //删除订单
const downloadApk = require('./router/downloadApk') // 下载apk


app.use('/', cors(), login)
app.use('/', cors(), getApkList)
app.use('/', cors(), orderVersion)
app.use('/', cors(), uploadApk)
app.use('/', cors(), bindingApk)
app.use('/', cors(), uploadPgyer)
app.use('/', cors(), deleteOrder)
app.use('/', cors(), operationOrder)
app.use('/', cors(), downloadApk)
app.use('/', cors(), home)

app.listen('3000', function () {
  console.log('开启了服务');
})

module.exports = app;