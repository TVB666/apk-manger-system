/*
 * @Descripttion: 用户绑定apk
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-22 21:15:28
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-23 02:35:53
 */
var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')
var fs = require('fs')


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
    platformType
  } = req.body
  if(!(userId && version && platformType && url)){
    !userId && res.status(515).send(handleRes.handleRes(515, 'userId 缺失'))
    !version && res.status(515).send(handleRes.handleRes(515, 'version 缺失'))
    !platformType && res.status(515).send(handleRes.handleRes(515, 'platformType 缺失'))
    !url && res.status(515).send(handleRes.handleRes(515, 'url 缺失'))
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
  const verResult = await new Promise((resolve, reject) => { ApkModel.find({version}).then(res => resolve([null, res])).catch(err => reject([err, null]))})
  // console.log('verResult', verResult);
  if (verResult[1].length === 0) { // 版本不存在
    res.status(512).send(handleRes.handleRes(512, ''))
    res.end()
    return;
  }

  // 此时已确认版本存在
  if (!fs.existsSync(url)) { //判断路径文件是否存在
    res.status(513).send(handleRes.handleRes(513, ''))
  } else if(verResult[1][0].userId !== Number(userId)){
    res.status(514).send(handleRes.handleRes(514, ''))
  } else {
    const ApkInfo = global.dbHandel.getModel('ApkInfo');
    const apkObj = { $set: {
        overTime: new Date().getTime() +  1000 * 60 * 60 * 24 * 3, // 超期时间
        bingTime: new Date().getTime(),
        orderStatus: 2,
        url,
      }
    }
    const whatUpdate = {userId: userId >> 0}
    const apkResult = await new Promise((resolve, reject) => {
      ApkInfo.updateMany(whatUpdate, apkObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
    })
    if (apkResult[0]) {
      res.status(500).send(handleRes.handleRes(500, '')) // ok
    } else {
      res.status(200).send(handleRes.handleRes(200, apkObj)) // ok
    }
  }
  res.end()
      
} catch (error) {
  res.status(500).send(handleRes.handleRes(500, '')) // ok
}
})

module.exports = router;