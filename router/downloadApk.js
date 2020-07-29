/**
 * @api {get} /downloadApk
 * @apiGroup 下载apk
 * @apiDescription  下载apk(下载按钮)
 * @apiVersion  1.0.0
 * 
 * @apiParam {String} url 文件路径
 * 
 * @apiHeader {String} token 
 * 
 * @apiSuccessExample {json} Success-Response:
 *   {  
 *    code: 200 ,
 *    msg: 'ok',
 *    res: {}
 *  }
 */

var express = require("express");
var router = express.Router();
var handleRes = require('../utils/handleResult')
var fs = require('fs')

router.get('/downloadApk', function(req, res){
  console.log('----------downloadApk---------', req.query);

  const {
    url
  } = req.query

  if(!url){
    res.status(515).send(handleRes.handleRes(515, ''))
    res.end();
    return;
  }

  if (!fs.existsSync(url)) { //判断路径文件是否存在
    res.status(513).send(handleRes.handleRes(513, ''))
    res.end();
    return;
  } else {
    res.download(url, function(err){
      if(err){
        console.log('err---', err);
        // throw err
        // res.status(519).send(handleRes.handleRes(519, ''))
        // res.end();
      }
    })
  }
})

module.exports = router;