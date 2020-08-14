'use strict';

// 列表相关操作
import express from 'express'
import ApkListComponent from '../prototype/apkListBase'
import uploadApk from './uploadApk'  // 上传apk

const router = express.Router()

router.get('/getList', ApkListComponent.getList); //获取列表
router.post('/appointment', ApkListComponent.appointment); //预约版本
router.post('/bindingApk', ApkListComponent.bindingApk); // 绑定版本&&apk
router.post('/operationOrder', ApkListComponent.operationOrder); // 订单操作
router.get('/downloadApk', ApkListComponent.downloadApk); // 下载操作
router.post('/uploadApk', uploadApk ); //上传apk


export default router
