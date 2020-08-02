/**
 * @api {post} /updataOrder
 * @apiGroup  预约单号驳回(准备弃用)
 * @apiDescription  预约单号驳回( 驳回)
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


router.post('/deleteOrder', async function(req,res){
  try {
    console.log('-----deleteOrder---------', req.body);

    // 检验token
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

    // 判断是否用户是否存在
    const UserModel = global.dbHandel.getModel('user');
    const userResult = await new Promise((resolve, reject) => {
      UserModel.find({userId: userId >> 0}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    if(userResult[0]) throw err
    if(userResult[1].length === 0){ // 用户名不存在
      res.status(510).send(handleRes.handleRes(510, ''))
      res.end()
      return;
    } 

      // 找预约号
    const ApkModel = global.dbHandel.getModel('ApkInfo');
    const findOrderResult = await new Promise((resolve, reject) => {
      ApkModel.find({orderId: orderId >> 0}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
    })
    if(findOrderResult[0]) throw err
    if(findOrderResult[1].length === 0){ // 预约号是否存在
      res.status(517).send(handleRes.handleRes(517, ''))
    } else if(findOrderResult[1][0].userId != userId ) { // 不是同一人
      res.status(516).send(handleRes.handleRes(516, ''))
    } else {
      var whereStr = {orderId: orderId >> 0};  
      const deleteResult = await new Promise((resolve, reject) => {
        ApkModel.deleteOne(whereStr).then(res => resolve([null ,res])).catch(err => reject([err, null]))
      })
      if(deleteResult[0]) throw err
      res.status(200).send(handleRes.handleRes(200, ''))
    }
    res.end();
  } catch (error) {
    res.status(500).send(handleRes.handleRes(500, error))
    res.end();
  }
})


module.exports = router;