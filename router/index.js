'use strict';

import admin from './admin'
import orderList from './orderList' 


export default app => {
  app.use('/admin', admin); // 账户
  app.use('/orderList', orderList); // 预约列表
// TODO 权限管理
}