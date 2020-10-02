'use strict';
// 正式服配置
module.exports = {
  port: 3000,
  //  parseInt(process.env.PORT, 10) ||
  url: 'mongodb://localhost:27017/apkManagerSystem',
  tokenSecret: 'apkmanagersystemNo1apkmanagersystemNo1',

  // 格力+ 平台配置
  domestic: {
    uploadUrl: 'https://www.pgyer.com/apiv2/app/upload', // 上传地址
    _api_key: '', 
    buildInstallType: 2, // 类型
    buildPassword: 'qwe!23' // 密码
    // buildPassword: 'iot4', 
  },
}