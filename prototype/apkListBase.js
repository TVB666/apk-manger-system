'use strict';

import BaseDao from './BaseDao'
import ApkListSchema from '../models/apkList'
import UserSchema from '../models/user'
import IdSequenceSchema from '../models/idSequence'
var fs = require('fs');

class ApkListComponent extends BaseDao {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.hasCorrectToken = this.hasCorrectToken.bind(this);
    this.appointment = this.appointment.bind(this);
  }
  
  // 校验token
  hasCorrectToken(req, res) {
    const token = req.headers.token
    const tokenResult = this.checkToken(token)
    if (!tokenResult.success) {
      res.status(501).send(this.handleRes(501, ''))
      res.end();
      return;
    }
    return true
  }

  // 获取列表
  async getList(req, res, next) {
    console.log('-----getList---------', req.query);

    const tokenRes = this.hasCorrectToken(req, res)
    if (!tokenRes) return

    const apkList = await ApkListSchema.find().reverse()
    const length = apkList.length
    let {
      page = 1,
      limit = 10
    } = req.query
    page = page >> 0
    limit = limit >> 0

    const startIndex = (page - 1) * limit
    const arrList = apkList.slice(startIndex, startIndex + (limit >> 0))
    const result = {
      total: length,
      total_pages: Math.ceil(length / 10),
      data: arrList,
      page: page >> 0,
      limit: limit >> 0
    }
    res.status(200).send(this.handleRes(200, result))
    res.end();
  };

  // 预约版本 
  async appointment(req, res, next) {

    const tokenRes = this.hasCorrectToken(req, res)
    if (!tokenRes) return

    console.log('-----appointment---------', req.body);

    let {
      userId = null,
      version = null,
      platformType = null
    } = req.body
    if (!userId || !version || !platformType) {
      res.status(515).send(this.handleRes(515))
      res.end()
      return;
    }

    // 找人
    userId = userId >> 0
    const user = UserSchema.find(userId)
    if (!user) {
      res.status(510).send(this.handleRes(510))
      res.end()
      return;
    }

    // 找是否有过该版本
    const findVer = {
      version,
      platformType
    }
    const apkList = await ApkListSchema.findOne(findVer)
    if (apkList) { // 判断有无
      if (apkList.userId == userId) { // 您已经绑定过该版本号了
        res.status(201).send(this.handleRes(201))
      } else { //判断该版本是否是该使用者 
        res.status(514).send(this.handleRes(514))
      }
    } else { // 无则绑定
      const orderId = await this.getNextSequenceValue()
      const writeObj = {
        // createdAt: new Date(),
        userId,
        userName: user.userName,
        createTime: new Date().getTime(), // 生成时间
        overTime: new Date().getTime() + 1000 * 60 * 20, // 超期时间
        orderStatus: 1, // 状态
        platformType, // 平台
        version,
        orderId,
      }
      const writeResult = await ApkListSchema.insertMany(writeObj)
      res.status(200).send(this.handleRes(200, writeResult))
    }
    res.end();
  };

  // 绑定版本&&apk
  async bindingApk(req, res, next){
    const tokenRes = this.hasCorrectToken(req, res)
    if (!tokenRes) return

    console.log('-----bindingApk---------', req.body);
    
    const {
      userId,
      url,
      version,
      platformType,
      describe,
      buildName
    } = req.body

    if(!(userId && url && version && platformType  && describe && buildName)){
      res.status(515).send(this.handleRes(515))
      return;
    }

    const userData = await ApkListSchema.findOne({ userId: userId >> 0})
    if(!userData){
      res.status(510).send(this.handleRes(510))
      return;
    }

    if (!fs.existsSync(url)) { //判断路径文件是否存在
      res.status(513).send(this.handleRes(513))
      res.end();
      return
    }

    const verResult = await ApkListSchema.findOne({version, platformType})
    let isExistenceVersion = true
    if (!verResult) { // 版本不存在
      isExistenceVersion = false
    }

    if(isExistenceVersion && verResult.userId !== Number(userId) ){ //版本存在 & 使用者相同
      res.status(514).send(this.handleRes(514))
    } else {

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
        const whatUpdate = {orderId: verResult.orderId >> 0}
        const apkResult = await ApkListSchema.updateOne({whatUpdate, setObj})

        if(!apkResult) throw err
        res.status(200).send(this.handleRes(200, apkObj)) // ok
  
      } else {
        console.log('--锁定版本--'); // 锁定版本
        const orderId = await this.getNextSequenceValue()
        const writeObj = {
          userId,
          userName: userData.userName,
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
        const writeResult = await ApkListSchema.insertMany(writeObj)
        if(!writeResult) throw err
        res.status(200).send(this.handleRes(200, writeResult[1][0])) // ok
      }
    }
    res.end()

  };

  // 订单操作 1 : 同意, 2: 驳回, 3: 删除
  async operationOrder(req, res, next){

    const tokenRes = this.hasCorrectToken(req, res)
    if (!tokenRes) return

      // 检验必传参数
      let {
        userId,
        orderId,
        operationType
      } = req.body
      if (!userId || !orderId || !operationType) {
        res.status(515).send(this.handleRes(515))
        res.end()
        return;
      }

      // 找人
      userId = userId >> 0
      const userData = UserSchema.find({userId})
      if (!userData) {
        res.status(510).send(this.handleRes(510))
        res.end()
        return;
      }

      // 校验订单号
      const orderIdList = await ApkListSchema.findOne({orderId: orderId >> 0})
      if(!orderIdList) {
        res.status(517).send(this.handleRes(517))
        res.end()
        return;
      }

    // 删除操作
    if (operationType == '3') {
      if (orderIdList.userId != userId && (Number(userData.manager) <= 1)) { // 不是同一人 或没有权限
        res.status(516).send(this.handleRes(516))
      } else {
        let whereStr = {
          orderId: orderId >> 0
        };
        const deleteResult =  await ApkListSchema.deleteOne(whereStr)
        if (!deleteResult) throw err
        res.status(200).send(this.handleRes(200))
      }
      res.end();
      return;
    }

    // 驳回操作
    if (operationType == '2') {
      if (userData.manager <= 1) { // 是否有权限操作
        res.status(516).send(this.handleRes(516))
      } else if (orderIdList.orderStatus != 2) { // 判断订单状态是否合法
        res.status(518).send(this.handleRes(518))
      } else {
        const updataObj = {
          checkerName: userData.userName,
          orderStatus: 3,
          checkTime: new Date()
        }
        const setObj = {
          $set: updataObj
        }
        const whatUpdate = {
          orderId: orderId >> 0
        }
        const updataResult =  await ApkListSchema.updateOne(whatUpdate, setObj)
        if (!updataResult) throw err
        res.status(200).send(this.handleRes(200))
      }
      res.end();
      return;
    }

    //  同意
    if (operationType == '1') {
      const fileUrl = orderIdList.url
      if (userData.manager < 1) { // 是否有权限操作
        res.status(516).send(this.handleRes(516))
      } else if (orderIdList.orderStatus != 2 || orderIdList.orderStatus != 3) { // 判断订单状态是否合法
        res.status(518).send(this.handleRes(518))
      } else if (!fs.existsSync(fileUrl)) { //判断路径文件是否存在
        res.status(513).send(this.handleRes(513))
      } else {
        // 上传前把预约状态修改为 '上传中'
        const beforeUpdataObj = {
          checkTime: new Date().getTime(),
          orderStatus: 5, // TODO枚举
          checkerId: userId >> 0
        }
        const beforeSetObj = {
          $set: beforeUpdataObj
        }
        const whatUpdate = {
          orderId: orderId >> 0
        }

        const beforeApkResult = await ApkListSchema.updateOne(whatUpdate, beforeSetObj)
        if (!beforeApkResult) throw err

        // 上传
        const updata = {
           // _api_key: 'f6214162182b85f2ef95eeb1e79c4c6a', // 鹏鹏的
          _api_key: '85c5f75e243c4cf088e8b3462dfe561a',
          file: {
            file: orderIdList.url,
            content_type: 'multipart/form-data'
          },
          buildInstallType: 2,
          buildPassword: 'qwe!23', //TODO读数据库
          // buildPassword: 'iot4', 
          buildUpdateDescription: orderIdList.describe,
          buildName: orderIdList.buildName  //平台
        }
        needle.post(pgyerUrl, updata, {
          multipart: true
        }, async function (err, resp, body) {
          let setObj = {}
          if (err) { // 上传失败
            console.log('err', err);
            setObj = {
              $set: {
                orderStatus: 6  //TODO枚举
              }
            }
          } else {
            // 上传成功 
            console.log('body', body);
            const updataObj = {
              finishTime: new Date().getTime(),
              orderStatus: 4, //TODO枚举
            }
            setObj = {
              $set: updataObj
            }
          }

          // 上传成功与否，都更新数据库
          const apkResult = await ApkListSchema.updateOne(whatUpdate, setObj)
          if (!apkResult) throw apkResult
          if (err) throw err

          res.status(200).send(handleRes.handleRes(200, apkResult[1]))
          // you can pass params as a string or as an object.
        });
        res.end();
      }
    }

  };

  // 下载apk
  downloadApk(req, res, next){
    console.log('----------downloadApk---------', req.query);

    const {
      url
    } = req.query
    if(!url){
      res.status(515).send(this.handleRes(515))
      res.end();
      return;
    }

    if (!fs.existsSync(url)) { //判断路径文件是否存在
      res.status(513).send(this.handleRes(513))
      res.end();
      return;
    } else {
      res.download(url, function(err){
        if(err){
          console.log('err---', err);
        }
      })
    }
  }

  // id自加一
  async getNextSequenceValue(){
    const sequenceDocument = await IdSequenceSchema.findOneAndUpdate(
      {"id_key": 'orderId' },
      {$inc:{sequence_value:1}},
      {new: true})
    return sequenceDocument.sequence_value;
  }
}


export default new ApkListComponent()