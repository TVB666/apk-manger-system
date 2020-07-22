var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')

// 预约版本
router.post('/orderVersion', async function (req, res) {
  try {
    console.log('---orderVersion----', req.body);
    const {
      userId,
      version,
      platformType
    } = req.body
    if(!(userId && version && platformType)){
      !userId && res.status(515).send(handleRes.handleRes(515, 'userId 缺失'))
      !version && res.status(515).send(handleRes.handleRes(515, 'version 缺失'))
      !platformType && res.status(515).send(handleRes.handleRes(515, 'platformType 缺失'))
      res.end()
      return;
    }
    const User = global.dbHandel.getModel('user');
    const Order = global.dbHandel.getModel('Order');
    const result = await new Promise((resolve, reject) => {
      User.find({userId: userId >> 0}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    if(result[1].length === 0){ // 用户名不存在
      res.status(510).send(handleRes.handleRes(510, ''))
      res.end()
      return;
    } 
    
    // 找版本号
    const orderResult = await new Promise((resolve, reject) => {
      Order.find({version, platformType}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    console.log('orderResult', orderResult);
    if(orderResult[1].length === 0){ // 版本不存在
      // 锁定版本
      console.log('--锁定版本--');
      const writeObj = {
        userId,
        userName: result[1][0].userName,
        createTime: new Date().getTime(), // 生成时间
        overTime: new Date().getTime() + 1000 * 60 * 60 * 24 *3, // 超期时间
        finishTime: 0,  // 
        orderStatus: 1, // 状态
        platformType, // 平台
        version,
        // orderId:
      }
      const writeResult = await new Promise((resolve, reject) => {
        Order.insertMany(writeObj).then(res => resolve([null ,res])).catch(err => reject([err, null]))
      })
      // console.log('writeResult', writeResult);
      if(writeResult[0]){
        res.status(500).send(handleRes.handleRes(500, '')) // ok
      }else{
        res.status(200).send(handleRes.handleRes(200, writeObj)) // ok
      }
    } else if(orderResult[1][0].userId != userId){ 
      res.status(514).send(handleRes.handleRes(514, '')) //判断该版本是否是该使用者
    } else {
      res.status(201).send(handleRes.handleRes(201, '')) // 您已经绑定过该版本号了
    }
    res.end()
  } catch (error) {
    res.status(500).send(handleRes.handleRes(500, ''))
    res.end()
  }
});

module.exports = router