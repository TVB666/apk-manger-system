/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-20 21:38:14
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-27 21:45:33
 */ 
/**
 * @api {get} /getApkList
 * @apiGroup 获取预约列表
 * @apiDescription  获取预约列表
 * @apiVersion  1.0.0
 * 
 * @apiParam {Number} page 页码
 * @apiParam {Number} limit 每页限制
 * 
 * @apiHeader {String} token  token
 * 
 * @apiSuccessExample {json} Success-Response:
 *   {  
 *      code: 200 ,
 *      msg: 'ok',
 *      res: {
 *        total: 总数,
 *        total_pages: 总页数,
 *        data: [{
            userId:10086,
            userName: 'admin',
            version:"100.10.112",
            describe: '我是描述'
            createTime:2020-07-23T11:27:34.483+00:00,
            fixTime: 2020-07-23T11:27:34.483+00:00, // 修改时间
            overTime: 2020-07-27T14:28:13.487+00:00,
            uploadTime: "2020-07-23T11:27:34.483+00:00" // 文件上传时间
            finishTime:null,
            checkTime： "2020-07-23T11:27:34.483+00:00" // 审批时间
            finishTime: "2020-07-23T11:27:34.483+00:00", // 完成时间
            orderStatus:2,  //   0: '未使用', 1: '预约使用中', 2: '待审核', 3: '待修改',  4: '已完成'
            platformType:0,  //  0: '格力+',  1: 'Gree+'
            url:"uploads\2020-7-24\Greeplus_In_4.0.0.20_202007248.apk",
            checkerId:null, // 审批人
            orderId:15 //订单id
 *        }],
 *        page: 页码,
 *        limit: 每页限制
 *      }
 *    }
 *
 **/
var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")
var handleRes = require('../utils/handleResult')


router.get("/getApkList", async function (req, res) {
  try {
    console.log('-----getApkList---------', req.query);
    const token = req.headers.token
    const tokenResult = tokenMethods.verifyToken(token)
    if (!tokenResult.success) {
      res.status(501).send(handleRes.handleRes(501, ''))
      res.end();
      return;
    }
    const ApkInfo = global.dbHandel.getModel('ApkInfo');
    const apkResult = await new Promise((resolve, reject) => {
      ApkInfo.find().then(res => resolve([null, res])).catch(err => reject([err, null]))
    })
    
    if (apkResult[0]) throw err;
    const apkList = apkResult[1]
    const length = apkList.length
    if (JSON.stringify(req.query) == '{}') {
      const result = {
        total: length,
        total_pages: Math.ceil(length / 10),
        data: apkList.slice(0, 10),
        page: 1,
        limit: 10,
      }
      res.status(200).send(handleRes.handleRes(200, result))
      res.end();
      return;
    }

    const {
      page,
      limit
    } = req.query

    if(Number(page) === NaN || Number(limit) === NaN){
      res.status(502).send(handleRes.handleRes(502, ''))
      res.end()
      return;
    }


    const startIndex = (page - 1) * limit

    const arrList = apkList.slice(startIndex, startIndex + (limit >> 0))

    const result = {
      total: length,
      total_pages: Math.ceil(length / 10),
      data: arrList,
      page: page >> 0,
      limit: limit >> 0
    }
    res.status(200).send(handleRes.handleRes(200, result))
    res.end();
  } catch (error) {
    res.status(500).send(handleRes.handleRes(500, ''))
    res.end();
  }
})

module.exports = router;