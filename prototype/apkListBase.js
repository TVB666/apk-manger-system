'use strict';

import BaseDao from './BaseDao'
import ApkListSchema from '../models/apkList'
import UserSchema from '../models/user'
import IdSequenceSchema from '../models/idSequence'

class ApkListComponent extends BaseDao {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.hasCorrectToken = this.hasCorrectToken.bind(this);
    this.appointment = this.appointment.bind(this);
  }

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

    const apkList = await ApkListSchema.find()
    const length = apkList.length
    let {
      page = 1,
      limit = 10
    } = req.query
    page = page >> 0
    limit = limit >> 0

    const startIndex = (page - 1) * limit
    const arrList = apkList.slice(startIndex, startIndex + (limit >> 0)).reverse()
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