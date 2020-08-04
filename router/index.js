'use strict';
import admin from './admin'
import orderList from './orderList' 


// import orderVersion from './router/orderVersion' // 预约版本
// import uploadApk from './router/uploadApk'  // 上传apk
// import bindingApk from './router/bindingApk' // 绑定apk
// import uploadPgyer from './router/uploadPgyer' // 上传蒲公英
// import deleteOrder from './router/deleteOrder' //删除预约
// import operationOrder from './router/operationOrder' //预约操作
// import downloadApk from './router/downloadApk' // 下载apk


export default app => {
  app.use('/admin', admin);
  app.use('/orderList', orderList);
  
  // app.use('/orderVersion', orderVersion);
  // app.use('/uploadApk', uploadApk);
  // app.use('/bindingApk', bindingApk);
  // app.use('/uploadPgyer', uploadPgyer);
  // app.use('/deleteOrder', deleteOrder);
  // app.use('/operationOrder', operationOrder);
  // app.use('/downloadApk', downloadApk);
  // app.use('/home', home);
}