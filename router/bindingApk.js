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
  // const token = req.headers.token
  // const tokenResult = tokenMethods.verifyToken(token)
  // if (!tokenResult.success) {
  //   res.send(handleRes.handleRes(501, '' ))
  //   res.end();
  //   return
  // } 
  console.log('---/bindingApk---', req.body);

  const {
    userId,
    url,
    version
  } = req.body
  const User = global.dbHandel.getModel('user');
  const Order = global.dbHandel.getModel('Order');
  const result = await new Promise((resolve, reject) => {
    User.find({
      userId: userId >> 0
    }).then(res => resolve([null, res])).catch(err => reject([err, null]))
  })
  if (result[0]) { // 是否服务器异常
    res.status(500).send(handleRes.handleRes(500, ''))
    res.end()
    return;
  } else if (result[1].length === 0) { // 用户名不存在
    res.status(510).send(handleRes.handleRes(510, ''))
    res.end()
    return;
  }
  // 此时已确认User存在
  const orderResult = await new Promise((resolve, reject) => {
    Order.find({
      version
    }).then(res => resolve([null, res])).catch(err => reject([err, null]))
  })
  // console.log('orderResult', orderResult);
  if (orderResult[1].length === 0) { // 版本不存在
    res.status(512).send(handleRes.handleRes(512, ''))
    res.end()
    return;
  }

  // 此时已确认版本存在
  if (!fs.existsSync(url)) { //判断路径文件是否存在
    res.status(513).send(handleRes.handleRes(513, ''))
  } else if(orderResult[1][0].userId !== Number(userId)){
    res.status(514).send(handleRes.handleRes(514, ''))
  } else {
    const ApkInfo = global.dbHandel.getModel('ApkInfo');
    const apkObj = {
      userId: userId >> 0,
      userName: result[1][0].userName,
      version,
      createTime: orderResult[1][0].createTime,
      overTime: orderResult[1][0].overTime,
      finishTime: new Date().getTime(),
      orderStatus: 2,
      platformType: orderResult[1][0].platformType,
      url,
      checkerId: 0
      // orderId:{type:Number},
    }
    console.log('url', url);
    const apkResult = await new Promise((resolve, reject) => {
      ApkInfo.insertMany(apkObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
    })
    if (apkResult[0]) {
      res.status(500).send(handleRes.handleRes(500, '')) // ok
    } else {
      const removeOrderResult = await new Promise((resolve, reject) => {
        Order.deleteOne({
          version
        }).then(res => resolve([null, res])).catch(err => reject([err, null]))
      })
      if (removeOrderResult[0]) {
        res.status(500).send(handleRes.handleRes(500, '')) // ok
      } else {
        res.status(200).send(handleRes.handleRes(200, apkObj)) // ok
      }
    }
  }
  res.end()
})

module.exports = router;