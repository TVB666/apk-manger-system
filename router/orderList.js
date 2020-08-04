'use strict';

// 列表相关操作
import express from 'express'
import ApkListComponent from '../prototype/apkListBase'
const router = express.Router()

router.get('/getList', ApkListComponent.getList); //获取列表


export default router
