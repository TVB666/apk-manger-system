/**
 * @api {post} /uploadApk
 * @apiGroup apk包上传
 * @apiDescription  apk包上传
 * @apiVersion  1.0.0
 * 
 * @apiParam {File} file 文件
 * @apiHeader {String} Content-Type 设置 multipart/form-data
 * 
 * @apiSuccessExample {json} Success-Response:
 *   {  
 *    code: 200 ,
 *    msg: 'ok',
 *    res: {
 *     url: url, // 文件路径
 *     size: size // 文件大小
 *    }
 *  }
 */

var express = require("express");
var fs = require("fs");
var router = express.Router();
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

router.post("/uploadApk", upload.array('file'), function(req, res){
  console.log('---/uploadApk----', req.files)
  
  if (!req.files || Object.keys(req.files).length === 0) { // 没有文件
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