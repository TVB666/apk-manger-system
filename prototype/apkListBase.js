'use strict';

import BaseDao from './BaseDao'
import ApkListSchema from '../models/apkList'
import UserSchema from '../models/user'
import IdSequenceSchema from '../models/idSequence'
import chalk from 'chalk';
import { orderStatus, operatTypeENUM, platform } from '../utils/index'
import * as address from '../utils/url'

import { platformConfig } from '../utils/config'

var fs = require('fs');
var needle = require('needle');

// const approveKey = 'SCU73771T7668a3da7413336e5dbe9a800bd9dc475e07536e41636' // 我的审批推送key
const approveKey = 'SCU111290T2a29638b5bf9e4c9882374b8c2b3f5cb5f4a07290c9ca' // 鹏鹏的审批推送key

class ApkListComponent extends BaseDao {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.hasCorrectToken = this.hasCorrectToken.bind(this);
    this.appointment = this.appointment.bind(this);
    this.operationOrder = this.operationOrder.bind(this);
    this.bindingApk = this.bindingApk.bind(this);
    this.downloadApk = this.downloadApk.bind(this);
    this.getNextSequenceValue = this.getNextSequenceValue.bind(this);
    this.sendWxTitle = this.sendWxTitle.bind(this);
  }
  
  // 校验token
  hasCorrectToken(req, res) {
    const token = req.headers.token
    const tokenResult = this.checkToken(token)
    if (!tokenResult.success) {
      this.sendRes(res, 501)
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

    let apkList = await ApkListSchema.find()
    apkList = apkList.reverse()
    const length = apkList.length
    let {
      page = 1,
      limit = 10
    } = req.query
    page = page >> 0
    limit = limit >> 0

    const startIndex = (page - 1) * limit
    let arrList = apkList.slice(startIndex, startIndex + (limit >> 0))
    for (let index = 0; index < arrList.length; index++) {
      const element = arrList[index];
      //  使用者id
      if(element.user_id){
        const userData = await UserSchema.findOne({ _id : element.user_id })
        if(userData)arrList[index].userName = userData.userName
      }else {
        const userData = await UserSchema.findOne({ userId : element.userId })
        if(userData)arrList[index].userName = userData.userName
      }
      //  审批id
      if(element.checker_id){
        const checkerData = await UserSchema.findOne({ _id: element.checker_id })
        if(checkerData) arrList[index].checkerName = checkerData.userName
      }else{
        const checkerData = await UserSchema.findOne({ userId: element.checkerId })
        if(checkerData) arrList[index].checkerName = checkerData.userName
      }
    }

    const result = {
      total: length,
      total_pages: Math.ceil(length / 10),
      data: arrList,
      page: page >> 0,
      limit: limit >> 0
    }
    this.sendRes(res, 200, result)
    res.end();
  };

  // 预约版本 
  async appointment(req, res, next) {
    console.log('-----appointment---------', req.body);

    const tokenRes = this.hasCorrectToken(req, res)
    if (!tokenRes) return

    let {
      userId = null,
      version = null,
      platformType = null
    } = req.body
    if (!userId || !version || !platformType) {
      this.sendRes(res, 515)
      res.end()
      return;
    }

    // 找人
    const userData = await UserSchema.findOne({userId: userId >> 0})
    if (!userData) {
      this.sendRes(res, 510)
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
      if (apkList.user_id == userData._id) { // 您已经绑定过该版本号了
        this.sendRes(res, 201)
      } else { //判断该版本是否是该使用者 
        this.sendRes(res, 514)
      }
    } else { // 无则绑定
      const orderId = await this.getNextSequenceValue()
      const writeObj = {
        user_id: userData._id,
        createTime: new Date().getTime(), // 生成时间
        overTime: new Date().getTime() + 1000 * 60 * 20, // 超期时间
        orderStatus: orderStatus.ENUM_order_use,
        platformType, // 平台
        version,
        orderId,
        // createdAt: Date.now()
      }
      const writeResult = await ApkListSchema.insertMany(writeObj)
      this.sendRes(res, 200, writeResult)
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
      this.sendRes(res, 515)
      return;
    }

    const userData = await UserSchema.findOne({ userId: userId >> 0})
    if(!userData){
      this.sendRes(res, 510)
      return;
    }

    if (!fs.existsSync(url)) { //判断路径文件是否存在
      this.sendRes(res, 513)
      res.end();
      return
    }

    const verResult = await ApkListSchema.findOne({version, platformType})
    let isExistenceVersion = true
    if (!verResult) { // 版本不存在
      isExistenceVersion = false
    }

    if(isExistenceVersion && verResult.user_id !== userData._id ){ //版本存在 & 使用者相同
      this.sendRes(res, 514)

    } else {

      if(isExistenceVersion){
        const apkObj = {
          overTime: new Date().getTime() +  1000 * 60 * 60 * 24 * 3, // 超期时间
          uploadTime: new Date().getTime(),
          orderStatus: orderStatus.ENUM_to_audit,
          url,
          describe,
          buildName
        }
        const setObj = { $set: apkObj }
        const whatUpdate = {orderId: verResult.orderId >> 0}
        const apkResult = await ApkListSchema.updateOne(whatUpdate, setObj)

        if(!apkResult) throw err
        this.sendRes(res, 200, apkObj)
      } else {
        console.log('--锁定版本--'); // 锁定版本
        const orderId = await this.getNextSequenceValue()
        const writeObj = {
          user_id: userData._id,
          createTime: new Date().getTime(), // 生成时间
          uploadTime: new Date().getTime(),
          overTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 3, // 超期时间
          orderStatus: orderStatus.ENUM_to_audit, // 状态
          platformType, // 平台
          version,
          url,
          describe,
          orderId: orderId >> 0,
          buildName,
        }
        const writeResult = await ApkListSchema.insertMany(writeObj)
        if(!writeResult) throw err
        this.sendRes(res, 200, writeResult)
        // 推送消息
        const text = `${userData.userName}上传了${buildName}。 \n 大帅比，请您及时处理。`
        const baseUrl = `${approveKey}.send?text=${encodeURI(text)}`
        this.sendWxTitle(baseUrl)
      }
    }
    res.end()
  };

  // 订单操作 1 : 同意, 2: 驳回, 3: 删除
  async operationOrder(req, res, next){
    console.log('-----operationOrder---------', req.body);

    const tokenRes = this.hasCorrectToken(req, res)
    if (!tokenRes) return
      // 检验必传参数
      let {
        userId,
        orderId,
        operationType
      } = req.body
      if (!userId || !orderId || !operationType) {
        this.sendRes(res, 515)
        res.end()
        return;
      }

      // 找人
      const userData = await UserSchema.findOne({userId: userId >> 0})
      if (!userData) {
        this.sendRes(res, 510)
        res.end()
        return;
      }

      // 校验订单号
      const orderIdList = await ApkListSchema.findOne({orderId: orderId >> 0})
      if(!orderIdList) {
        this.sendRes(res, 517)
        res.end()
        return;
      }

      // 订单使用者信息
      this.apkUserData = await UserSchema.findOne({_id:  orderIdList.user_id})

    // 删除操作
    if (operationType == operatTypeENUM.ENUM_delete) {
      const notSimpleId = (JSON.stringify(orderIdList.user_id) != JSON.stringify(userData._id))
      if (notSimpleId && (userData.manager <= 1)) { // 不是同一人 且 没有权限
        this.sendRes(res, 516)
      } else {
        let whereStr = {
          orderId: orderId >> 0
        };
        const deleteResult =  await ApkListSchema.deleteOne(whereStr)
        if (!deleteResult) throw err
        this.sendRes(res, 200)
      }
      res.end();
      return;
    }

    // 驳回操作
    if (operationType == operatTypeENUM.ENUM_rejected) {
      if (userData.manager < 1) { // 是否有权限操作
        this.sendRes(res, 516)
      } else if (orderIdList.orderStatus != orderStatus.ENUM_to_audit) { // 判断订单状态是否合法
        this.sendRes(res, 518)
      } else {
        const updataObj = {
          checker_id: userData._id,
          orderStatus: orderStatus.ENUM_to_modify,
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
        this.sendRes(res, 200)
      }
      res.end();
      return;
    }

    //  同意
    if (operationType == operatTypeENUM.ENUM_agree) {
      const fileUrl = orderIdList.url
      if (userData.manager < 1) { // 是否有权限操作
        this.sendRes(res, 516)
      } else if (orderIdList.orderStatus != orderStatus.ENUM_to_audit && orderIdList.orderStatus != orderStatus.ENUM_to_modify) { 
        // 判断订单状态是否合法
        this.sendRes(res, 518)
      } else if (!fs.existsSync(fileUrl)) { //判断路径文件是否存在
        this.sendRes(res, 513)
      } else {
        // 上传前把预约状态修改为 '上传中'
        const beforeUpdataObj = {
          checkTime: new Date().getTime(),
          orderStatus: orderStatus.ENUM_upload_ing,
          checker_id: userData._id,
        }
        const beforeSetObj = {
          $set: beforeUpdataObj
        }
        const whatUpdate = {
          orderId: orderId >> 0
        }
        const beforeApkResult = await ApkListSchema.updateOne(whatUpdate, beforeSetObj)
        if (!beforeApkResult) throw err
        this.sendRes(res, 200, beforeApkResult)
        res.end();

        // 上传
        
        const config = platformConfig[platform[platformType]]
        const updata = {
           _api_key: config._api_key,
          file: {
            file: orderIdList.url,
            content_type: 'multipart/form-data'
          },
          buildInstallType: config.buildInstallType,
          buildPassword: config.buildPassword, 
          buildUpdateDescription: orderIdList.describe,
          buildName: orderIdList.buildName  //平台
        }
        let that = this
        console.log(chalk.green('-------开始上传----'));
        needle.post(config.uploadUrl, updata, {
          multipart: true
        }, async function (err, resp, body) {
          let setObj = {}
          if (err) { // 上传失败
            console.log('err', err);
            setObj = {
              $set: {
                orderStatus: orderStatus.ENUM_upload_err 
              }
            }
            text =  `${orderIdList.buildName}上传失败。请再次上传`
            const baseUrl = `${approveKey}.send?text=${encodeURI(text)}`
            that.sendWxTitle(baseUrl)
          } else {
            // 上传成功 
            console.log('body', body);
            const updataObj = {
              finishTime: new Date().getTime(),
              orderStatus: orderStatus.ENUM_has_been, 
            }
            setObj = {
              $set: updataObj
            }
            if(that.apkUserData.sckey){
              const text = `尊敬的${userData.userName}, 您的${orderIdList.buildName}已成功上传蒲公英。详情请移步蒲公英查看`
              const baseUrl = `${approveKey}.send?text=${encodeURI(text)}`
              that.sendWxTitle(baseUrl)
            } else {
              console.log(chalk.yellow(`--${that.apkUserData.userName}--没有sckey-`));
            }
          }

          // 上传成功与否，都更新数据库
          const apkResult = await ApkListSchema.updateOne(whatUpdate, setObj)
          if (!apkResult) throw err
          if (err) throw err
          // you can pass params as a string or as an object.
        });
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
      this.sendRes(515)
      res.end();
      return;
    }

    if (!fs.existsSync(url)) { //判断路径文件是否存在
      this.sendRes(513)
      res.end();
      return;
    } else {
      res.download(url, function(err){
        if(err){
          console.log('err---', err);
        }
      })
    }
  };

  // id自加一
  async getNextSequenceValue(){
    const sequenceDocument = await IdSequenceSchema.findOneAndUpdate(
      {"id_key": 'orderId' },
      {$inc:{sequence_value:1}},
      {new: true})
    return sequenceDocument.sequence_value;
  };

  // 发送微信消息
  sendWxTitle(baseUrl){
    const url = address.sendWxNoticeUrl + baseUrl
    needle.get(url, function(err, resp, body){
      if(err){
        console.log(chalk.red(err));
      }
    })
  }

  async test(req, res, next){
    let {
      userId,
      orderId,
      operationType
    } = req.body
    const orderIdList = await ApkListSchema.findOne({orderId: orderId >> 0})
    const result = await UserSchema.findOne({_id: orderIdList.user_id })
    console.log('result', result);
    res.status(200).send(result)
    res.end();
  }
}


export default new ApkListComponent()