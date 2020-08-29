import express from "express";
import fs from "fs";
import multer from "multer";
const router = express.Router()
import { handleRes } from '../utils'



// 更改大文件的存储路径
// var createFolder = function(folder){
//   try{
//     fs.accessSync(folder);
//   }catch( e ){
//     fs.mkdirSync(folder);
//   }
// };
var limits = {
  //限制文件大小10kb
  // fileSize: 10*1000,
  //限制文件数量
  files: 1
}

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
  }
})

var fileFilter = function(req, file, cb) {
   // 限制文件上传类型
  if(file.mimetype == 'application/vnd.android.package-archive' || file.mimetype == 'application/octet-stream'){
    cb(null, true)
  } else {
    cb(null, false)
  }
}

var upload = multer({storage, fileFilter})
var uploadfileSingle = upload.array('file')

const uploadApk = function(req, res){
  console.log('---/uploadApk----')
  uploadfileSingle(req, res, (err) => {
    if(err){
      res.status(521).send(handleRes(521, 'err'))
      return
    }
    console.log('req.files', req.files);
    if (!req.files || Object.keys(req.files).length === 0) { // 没有文件
      res.status(400).send(handleRes(400));
    } else {
      const resultObj = {
        url: req.files[0].path,
        size: req.files[0].size
      }
      res.status(200).send(handleRes(200, resultObj))
    }
    res.end();
  })

  // console.log('req', req.file);
  // console.log('------upload-----');
  // console.log(req.body);
  // console.log(req.files);
  // var file = req.files.logo;//From the name
  // console.log('文件类型：%s', file.type);
  // console.log('原始文件名：%s', file.name);
  // console.log('文件大小：%s', file.size);
  // console.log('文件保存路径：%s', file.path);
}

export default uploadApk
