/*
 * @Descripttion: 文件上传
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-21 22:32:19
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-23 00:16:24
 */ 
var express = require("express");
var fs = require("fs");
var router = express.Router();
var tokenMethods = require("../utils/token")
const path = require("path");
var multer  = require('multer');
var bodyParser = require('body-parser')
var handleRes = require('../utils/handleResult')

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

// 更改大文件的存储路径
var createFolder = function(folder){
  try{
    fs.accessSync(folder);
  }catch( e ){
    fs.mkdirSync(folder);
  }
};


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log('-------')
      const d = new Date()
      const nowDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      var uploadFolder = `./uploads/${nowDay}`;// 设定存储文件夹路径
      if (!fs.existsSync(uploadFolder)){ // 如果没有该路劲，则创建一个
          fs.mkdirSync(uploadFolder);
      }
      cb(null, uploadFolder); 
  },
  filename: function (req, file, cb) { // 在这里设定文件名
      cb(null, file.originalname);
  }})

var upload = multer({ storage: storage })

router.post("/upload", upload.array('file'), function(req, res){
  console.log('---/upload----', req.files)
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send(handleRes.handleRes(400, ''));
  } else {
    const resultObj = {
      url: req.files[0].path,
      size: req.files[0].size
    }
    res.status(200).send(handleRes.handleRes(200, resultObj))
  }
  res.end();
  // console.log('req', req.file);
  
  // console.log('------upload-----');
  // console.log(req.body);
  // console.log(req.files);
  // var file = req.files.logo;//From the name
  // console.log('文件类型：%s', file.type);
  // console.log('原始文件名：%s', file.name);
  // console.log('文件大小：%s', file.size);
  // console.log('文件保存路径：%s', file.path);
})

module.exports = router;