'use strict';
// 用户相关操作路由在此文件
import express from 'express'
import UserComponent from '../prototype/userBase'
const router = express.Router()

router.post('/login', UserComponent.login); //登录
// TODO 修改密码

export default router
