/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-15 22:25:45
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-15 22:33:51
 */ 
const jwt = require("jsonwebtoken");

const secret = "apkmanagersystemNo1";
// https://www.jianshu.com/p/576dbf44b2ae

// 生成token
function createToken(payload){
    payload.platformType = 'apkManager';
    payload.exp = new Date().getTime() + 60 * 60 * 2 * 1000; // 两小时有效
    return jwt.sign(payload,secret);
}

// 校检token
function verifyToken(token){
  let result = '';
  if (token) {
    // 解码 token (验证 secret 和检查有效期（exp）)
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        result = {
          success: false,
          message: '糟糕，认证已过期，请重新登录！'
        }
      } else {
        // 如果验证通过，在req中写入解密结果
        result = {
          success: true,
          message: 'token验证成功'
        }
      }
    });
  } else {
    // 没有拿到token 返回错误
    result = {
      success: false,
      message: '没有找到token呀~'
    }
  }
  return result
}
module.exports = {
  createToken,verifyToken
}