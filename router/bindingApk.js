/**
 * @api {post} /bindingApk
 * @apiGroup 绑定apk包
 * @apiDescription  绑定apk包
 * @apiVersion  1.0.0
 * 
 * @apiParam {Number} userId 用户id
 * @apiParam {String} url 文件路径 
 * @apiParam {String} version 预约版本 
 * @apiParam {Number} platformType 平台  0: '格力+', 1: 'GREE+'
 * @apiParam {String} describe 描述 
 * 
 * @apiHeader {String} token 
 * 
 * @apiSuccessExample {json} Success-Response:
 *  * {  
 *      code: 200 ,
 *      msg: 'ok',
 *      res: {
 *       uploadTime: 绑定时间,
 *       overTime： 绑定时间+ 3天,
 *       orderStatus: 3,
 *       url: 文件路径
 *      }
 *    }
 *
 **/

var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')
var fs = require('fs');
const { log } = require("util");


router.post('/bindingApk', async function (req, res) {
  try {
  const token = req.headers.token
  const tokenResult = tokenMethods.verifyToken(token)
  if (!tokenResult.success) {
    res.send(handleRes.handleRes(501, '' ))
    res.end();
    return
  } 

  console.log('---/bindingApk---', req.body);
  const {
    userId,
    url,
    version,
    platformType,
    describe,
    buildName
  } = req.body
  if(!(userId && version && platformType && url && describe && buildName)){
    res.status(515).send(handleRes.handleRes(515, ''))
    res.end()
    return;
  }

  const User = global.dbHandel.getModel('user');
  const ApkModel = global.dbHandel.getModel('ApkInfo');
  const result = await new Promise((resolve, reject) => {
    User.find({
      userId: userId >> 0
    }).then(res => resolve([null, res])).catch(err => reject([err, null]))
  })
  if (result[1].length === 0) { // 用户名不存在
    res.status(510).send(handleRes.handleRes(510, ''))
    res.end()
    return;
  }
  // 此时已确认User存在

  if (!fs.existsSync(url)) { //判断路径文件是否存在
    res.status(513).send(handleRes.handleRes(513, ''))
    res.end();
    return
  }
  console.log('---------------');
  const verResult = await new Promise((resolve, reject) => { ApkModel.find({version, platformType}).then(res => resolve([null, res])).catch(err => reject([err, null]))})
  let isExistenceVersion = true
  if (verResult[1].length === 0) { // 版本不存在
    isExistenceVersion = false
  }
  
 if(isExistenceVersion && verResult[1][0].userId !== Number(userId) ){ //版本存在 & 使用者相同
    res.status(514).send(handleRes.handleRes(514))
  } else {
    const ApkInfo = global.dbHandel.getModel('ApkInfo');
    if(isExistenceVersion){
      const apkObj = {
        overTime: new Date().getTime() +  1000 * 60 * 60 * 24 * 3, // 超期时间
        uploadTime: new Date().getTime(),
        orderStatus: 2,
        url,
        describe,
        buildName
      }
      const setObj = { $set: apkObj }
      const whatUpdate = {orderId: verResult[1][0].orderId >> 0}
      const apkResult = await new Promise((resolve, reject) => {
        ApkInfo.updateOne(whatUpdate, setObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
      })
      if(apkResult[0]) throw err
      res.status(200).send(handleRes.handleRes(200, apkObj)) // ok

    } else {
      console.log('--锁定版本--'); // 锁定版本
      const orderId  = await global.dbHandel.getNextSequenceValue('orderId')   
      const writeObj = {
        userId,
        userName: result[1][0].userName,
        createTime: new Date().getTime(), // 生成时间
        uploadTime: new Date().getTime(),
        overTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 3, // 超期时间
        orderStatus: 2, // 状态
        platformType, // 平台
        version,
        url,
        describe,
        orderId: orderId >> 0,
        buildName,
      }
      const writeResult = await new Promise((resolve, reject) => {
        ApkModel.insertMany(writeObj).then(res => resolve([null ,res])).catch(err => reject([err, null]))
      })
      if(writeResult[0]) throw err
      res.status(200).send(handleRes.handleRes(200, writeResult[1][0])) // ok
    }
  }
  res.end()

} catch (error) {
  res.status(500).send(handleRes.handleRes(500)) // ok
}
})

module.exports = router;