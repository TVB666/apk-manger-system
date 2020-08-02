
/**
 * @api {post} /uploadPgyer
 * @apiGroup 上传蒲公英(准备弃用)
 * @apiDescription  上传蒲公英(同意按钮)
 * @apiVersion  1.0.0
 * 
 * @apiParam {Number} userId 用户id
 * @apiParam {Number} orderId 预约单号 
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
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')
var fs = require('fs')
var needle = require('needle');

const pgyerUrl = 'https://www.pgyer.com/apiv2/app/upload'

// var options = {
//   headers: { 'enctype': 'multipart/form-data' }
// }

router.post('/uploadPgyer', async function (req, res) {
  try {
    console.log('-----uploadPgyer---------', req.body);
    const token = req.headers.token
    const tokenResult = tokenMethods.verifyToken(token)
    if (!tokenResult.success) {
      res.status(501).send(handleRes.handleRes(501, ''))
      res.end();
      return;
    }
    
    // 检验必传参数
    const { userId, orderId }  = req.body
    if(!userId || !orderId) {
      res.status(515).send(handleRes.handleRes(515, ''))
      res.end()
      return;
    }

    let isCheckUser = true
    const UserModel = global.dbHandel.getModel('user');
    const userResult = await new Promise((resolve, reject) => {
      UserModel.find({userId: userId >> 0}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    if(userResult[0]) throw err
    if(userResult[1].length === 0){ // 用户名不存在
      res.status(510).send(handleRes.handleRes(510, ''))
      isCheckUser = false;
    } else if(userResult[1][0] < 1){ // 是否有权限操作
      res.status(516).send(handleRes.handleRes(516, ''))
      isCheckUser = false;
    }
    if(!isCheckUser){
      res.end()
      return;
    }
    

    // 找预约号 及校验
    let isCheckOrder = true
    const ApkModel = global.dbHandel.getModel('ApkInfo');
    const findOrderResult = await new Promise((resolve, reject) => {
      ApkModel.find({orderId: orderId >> 0}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    if(findOrderResult[0]) throw err
    if(findOrderResult[1].length === 0){ // 预约是否存在
      res.status(517).send(handleRes.handleRes(517, ''))
      isCheckOrder = false;
    } else if(findOrderResult[1][0].orderStatus != '2' || findOrderResult[1][0].orderStatus != '3'){ // 校验预约是否合法
      res.status(518).send(handleRes.handleRes(518, ''))
      isCheckOrder = false;
    } else {
      const fileUrl = findOrderResult[1][0].url
      if (!fs.existsSync(fileUrl)) { //判断路径文件是否存在
        console.log('-----文件不存在------');
        res.status(513).send(handleRes.handleRes(513, ''))
        isCheckOrder = false;
      }
    }
    if(!isCheckOrder){
      res.end()
      return;
    }


    // 上传前把预约状态修改为 '上传中'
    const beforeUpdataObj = {
      checkTime: new Date().getTime(),
      orderStatus: 5,
      checkerId: userId >> 0
    }
    const beforeSetObj = { $set: beforeUpdataObj }
    const whatUpdate = {orderId: orderId >> 0}
    const beforeApkResult = await new Promise((resolve, reject) => {
      ApkModel.updateOne(whatUpdate, beforeSetObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
    })
    if(beforeApkResult[0]) throw err

    // 上传
    var data = {
      _api_key: '85c5f75e243c4cf088e8b3462dfe561a',
      file: {
        file: findOrderResult[1][0].url,
        content_type: 'multipart/form-data'
      },
      buildInstallType: 2,
      buildPassword: 'iot4',
      buildUpdateDescription: findOrderResult[1][0].describe,
      buildName: handleRes.platformType[findOrderResult[1][0].platformType] //平台
    }
    needle.post(pgyerUrl, data, {
      multipart: true
    }, async function (err, resp, body) {
      let setObj = {}
      if(err) { // 上传失败
        console.log('err', err);
        setObj = { $set: {orderStatus: 6} }
      } else {
        // 上传成功 
        console.log('body', body);
        const updataObj = {
          finishTime: new Date().getTime(), 
          orderStatus: 4,
        }
        setObj = { $set: updataObj }
      }
      
      // 上传成功与否，都更新数据库
      const apkResult = await new Promise((resolve, reject) => {
        ApkModel.updateOne(whatUpdate, setObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
      })
      if(apkResult[0]) throw apkResult[0]
      if(err) throw err

      res.status(200).send(handleRes.handleRes(200, apkResult[1]))
      res.end();
      // you can pass params as a string or as an object.
    });
  } catch (error) {
    res.status(500).send(handleRes.handleRes(500, error))
    res.end();
  }
})

module.exports = router;