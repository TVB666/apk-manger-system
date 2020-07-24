/*
 * @Descripttion: 启动后端
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-13 22:16:16
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-25 00:33:09
 */
var express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
var bodyParser = require('body-parser')


global.dbHandel = require('./utils/dbHandle');
global.db = mongoose.connect("mongodb://localhost:27017/apkManagerSystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {
    console.log('数据库连接成功')
  })



//声明后端接口的访问路由
var app = express()
app.use(bodyParser.urlencoded({extended: false})) //解析表单数据需要用到的模块
app.use(bodyParser.json())
const getApkList = require('./router/getApkList')
const home = require('./router/home')
const login = require('./router/login')
const orderVersion = require('./router/orderVersion')
const upload = require('./router/upload')
const bindingApk = require('./router/bindingApk')
const uploadPgyer = require('./router/uploadPgyer')

app.use('/', cors(), login)
app.use('/', cors(), getApkList)
app.use('/', cors(), orderVersion)
app.use('/', cors(), upload)
app.use('/', cors(), bindingApk)
app.use('/', cors(), uploadPgyer)
app.use('/', cors(), home)

app.listen('3000', function () {
  console.log('开启了服务');
})

module.exports = app;