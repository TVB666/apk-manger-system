/**
 * @api {post} /orderVersion
 * @apiGroup 预约版本
 * @apiDescription  预约版本
 * @apiVersion  1.0.0
 * 
 * @apiParam {Number} userId 用户id
 * @apiParam {String} version 预约的版本 
 * @apiParam {Number} platformType 平台  0: '格力+', 1: 'GREE+'
 * 
 * @apiHeader {String} token 
 * 
 * @apiSuccessExample {json} Success-Response:
 *   {  
 *    code: 200 ,
 *    msg: 'ok',
 *    res: {
        userId: 10000,
        createTime: 1595818787325, // 生成时间
        overTime: 1595821787325, // 超期时间
        finishTime: null,  // 
        orderStatus: 1, // 状态 
        platformType： 0, // 平台
        version: version,
        url: null,
        checkerId: null,
        orderId: 1
      }
 *  }
 */

var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')

// 预约版本
router.post('/orderVersion', async function (req, res) {
  try {
    const token = req.headers.token
    const tokenResult = tokenMethods.verifyToken(token)
    if (!tokenResult.success) {
      res.send(handleRes.handleRes(501, '' ))
      res.end();
      return
    } 

    console.log('---orderVersion----', req.body);
    const {
      userId,
      version,
      platformType
    } = req.body
    if(!(userId && version && platformType)){
      res.status(515).send(handleRes.handleRes(515, ''))
      res.end()
      return;
    }

    const User = global.dbHandel.getModel('user');
    const userResult = await new Promise((resolve, reject) => {
      User.find({userId: userId >> 0}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    if(userResult[1].length === 0){ // 用户名不存在
      res.status(510).send(handleRes.handleRes(510, ''))
      res.end()
      return;
    } 
    
    // 找版本号
    const ApkModel = global.dbHandel.getModel('ApkInfo');
    const findVerResult = await new Promise((resolve, reject) => {
      ApkModel.find({version, platformType}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    try {
      ApkModel.createIndexes({ "createdAt": 1 }, { expireAfterSeconds: 20 } )
    } catch (error) {
      console.log('-------',error);
    }
    console.log('findVerResult', findVerResult);
    if(findVerResult[1].length === 0){ // 版本不存在
      console.log('--锁定版本--'); // 锁定版本
      const orderId  = await global.dbHandel.getNextSequenceValue('orderId')   
      const writeObj = {
        createdAt: new Date(),
        userId,
        userName: userResult[1][0].userName,
        createTime: new Date().getTime(), // 生成时间
        overTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 3, // 超期时间
        orderStatus: 1, // 状态
        platformType, // 平台
        version,
        orderId: orderId >> 0,
      }
      const writeResult = await new Promise((resolve, reject) => {
        ApkModel.insertMany(writeObj).then(res => resolve([null ,res])).catch(err => reject([err, null]))
      })
      console.log('writeResult', writeResult);
      if(writeResult[0]){
        res.status(500).send(handleRes.handleRes(500, '')) // ok
      }else{
        res.status(200).send(handleRes.handleRes(200, writeResult[1][0])) // ok
      }
    } else if(findVerResult[1][0].userId != userId){ 
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