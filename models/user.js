'use strict'

import mongoose from 'mongoose'
import { ObjectId } from 'mongodb';

const Schema = mongoose.Schema

const userSchema = new Schema({
  userName: String, // 账号
  userId: Number, // id
  psw: String, // 密码
  createTime: { // 创建时间
    type: Date,
    default: Date.now
  }, // 创建时间
  manager: Number, // 管理级别 0: 普通用户  1:普通管理、 2:超级管理员
  checkerId: Number, // 创建者id
  account: String, // 账户名字
  _id: ObjectId, // 数据库id
  sckey: String, // 推送key
})

userSchema.index({id: 1});

const UserSchema = mongoose.model('user', userSchema, 'user')

export default UserSchema