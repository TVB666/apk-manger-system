/**
 * @api {post} /operationOrder
 * @apiGroup 订单操作
 * @apiDescription  订单操作(同意、驳回、删除)
 * @apiVersion  1.0.0
 * 
 * @apiParam {Number} userId 用户id
 * @apiParam {Number} orderId 预约单号 
 * @apiParam {Number} operationType 操作类型 1 : 同意, 2: 驳回, 3: 删除
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

router.post('/operationOrder', async function (req, res) {
  try {
    console.log('-----operationOrder---------', req.body);

    // 校验token
    const token = req.headers.token
    const tokenResult = tokenMethods.verifyToken(token)
    if (!tokenResult.success) {
      res.status(501).send(handleRes.handleRes(501, ''))
      res.end();
      return;
    }

    // 检验必传参数
    const {
      userId,
      orderId,
      operationType
    } = req.body
    if (!userId || !orderId || !operationType) {
      res.status(515).send(handleRes.handleRes(515, ''))
      res.end()
      return;
    }

    // 校验用户
    const UserModel = global.dbHandel.getModel('user');
    const userResult = await new Promise((resolve, reject) => {
      UserModel.findOne({
        userId: userId >> 0
      }).then(res => resolve([null, res])).catch(err => reject([err, null]))
    })
    if (userResult[0]) throw err
    if (userResult[1].length === 0) { // 用户名不存在
      res.status(510).send(handleRes.handleRes(510, ''))
      res.end()
      return;
    }

    // 校验订单号
    const ApkModel = global.dbHandel.getModel('ApkInfo');
    const findOrderResult = await new Promise((resolve, reject) => {
      ApkModel.findOne({
        orderId: orderId >> 0
      }).then(res => resolve([null, res])).catch(err => reject([err, null]))
    })
    if (findOrderResult[0]) throw err
    if (findOrderResult[1].length === 0) { // 订单是否存在
      res.status(517).send(handleRes.handleRes(517, ''))
      res.end()
      return;
    }


    // 删除操作
    if (type == 3) {
      if (findOrderResult[1][0].userId != userId) { // 不是同一人
        res.status(516).send(handleRes.handleRes(516, ''))
      } else {
        var whereStr = {
          orderId: orderId >> 0
        };
        const deleteResult = await new Promise((resolve, reject) => {
          ApkModel.deleteOne(whereStr).then(res => resolve([null, res])).catch(err => reject([err, null]))
        })
        if (deleteResult[0]) throw err
        res.status(200).send(handleRes.handleRes(200, ''))
      }
      res.end();
      return;
    }

    // 驳回操作
    if (type == 2) {
      if (userResult[1][0] < 1) { // 是否有权限操作
        res.status(516).send(handleRes.handleRes(516, ''))
      } else if (findOrderResult[1][0].orderStatus != 2) { // 判断订单状态是否合法
        res.status(518).send(handleRes.handleRes(518, ''))
      } else {
        const updataObj = {
          checkerId: userId,
          orderStatus: 3,
          checkTime: new Date()
        }
        const setObj = {
          $set: updataObj
        }
        const whatUpdate = {
          orderId: orderId >> 0
        }
        const updataResult = await new Promise((resolve, reject) => {
          ApkModel.updateOne(whatUpdate, setObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
        })
        if (updataResult[0]) throw err
        res.status(200).send(handleRes.handleRes(200, ''))
      }
      res.end();
      return;
    }

    //  同意
    if (type == 1) {
      const fileUrl = findOrderResult[1][0].url
      if (userResult[1][0] < 1) { // 是否有权限操作
        res.status(516).send(handleRes.handleRes(516, ''))
      } else if (!fs.existsSync(fileUrl)) { //判断路径文件是否存在
        res.status(513).send(handleRes.handleRes(513, ''))
      } else if (findOrderResult[1][0].orderStatus != 2) { // 判断订单状态是否合法
        res.status(518).send(handleRes.handleRes(518, ''))
      } else {
        // 上传
        const updata = {
          _api_key: '85c5f75e243c4cf088e8b3462dfe561a',
          file: {
            file: findOrderResult[1][0].url,
            content_type: 'multipart/form-data'
          },
          buildInstallType: 2,
          buildPassword: 'iot4',
          buildUpdateDescription: findOrderResult[1][0].describe,
          buildName: '格力+'
        }
        needle.post(pgyerUrl, updata, {
          multipart: true
        }, async function (err, resp, body) {
          console.log('err', err);
          if (err) throw err
          console.log('body', body);
          // 更新数据库
          const updataObj = {
            checkTime: new Date().getTime(),
            finishTime: new Date().getTime(),
            orderStatus: 4,
            checkerId: userId >> 0
          }
          const setObj = {
            $set: updataObj
          }
          const whatUpdate = {
            orderId: orderId >> 0
          }
          const apkResult = await new Promise((resolve, reject) => {
            ApkModel.updateOne(whatUpdate, setObj).then(res => resolve([null, res])).catch(err => reject([err, null]))
          })
          if (apkResult[0]) throw err
          res.status(200).send(handleRes.handleRes(200, apkResult[1][0]))
          // you can pass params as a string or as an object.
        });
        res.end();
      }
    }
  } catch (error) {
    res.status(500).send(handleRes.handleRes(500, error))
    res.end();
  }
})

module.exports = router;