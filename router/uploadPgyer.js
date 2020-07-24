/*
 * @Descripttion: 上传蒲公英
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-25 00:33:25
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-25 07:23:22
 */ 

var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')
var fs = require('fs')
var needle = require('needle');

const pgyerUrl = 'https://www.pgyer.com/apiv2/app/upload'

// var options = {
//   headers: { 'enctype': 'multipart/form-data' }
// }
const fileUrl = 'uploads\\2020-7-24\\Greeplus_In_4.0.0.20_202007248.apk'

router.post('/uploadPgyer', function(req, res){

  if (!fs.existsSync(fileUrl)) { //判断路径文件是否存在
    console.log('文件不存在不存在不存在不存在');
    res.status(513).send(handleRes.handleRes(513, ''))
    res.end();
    return;
  }else{
    console.log('文件存在');
  }
  var  data = {
    _api_key: '85c5f75e243c4cf088e8b3462dfe561a',
    file: {file: fileUrl, content_type: 'multipart/form-data'},
    buildInstallType: 2,
    buildPassword: 'iot4',
    buildUpdateDescription: 'apk测试使用,  非专业人士勿下载',
    buildName: '干得不错啊'
  }
  needle.post(pgyerUrl, data, { multipart: true }, function(err, resp, body) {
    console.log('err', err);
    // console.log('resp', resp);
    console.log('body', body);
    res.status(200).send(handleRes.handleRes(200, '-----'))
    res.end();
  // you can pass params as a string or as an object.
});
})

module.exports = router;
