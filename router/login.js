/*
 * @Descripttion: 登录
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-15 22:30:20
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-23 00:11:57
 */ 
var { checkToken , createToken } = require("../utils/token")

var express = require("express");
var md5 = require("js-md5");
var router  = express.Router();
var handleRes = require('../utils/handleResult')

const username = "admin"
const pswpsw = "123456"
const md5psw = md5(md5(pswpsw))


router.post('/login', async function(req, res) {
  console.log('--login--', req.body);
  const {userName, psw} = req.body
  const User = global.dbHandel.getModel('user');

  const result = await new Promise((resolve, reject) => {
    User.find({userName}).then(res => resolve([null ,res])).catch(err => reject([err, null]))
  })

  if(result[0]){ // 是否服务器异常
    res.status(500).send(handleRes.handleRes(500, ''))
  } else if(result[1].length === 0){ // 用户名不存在
    res.status(510).send(handleRes.handleRes(510,  ''))
  } else if(result[1][0].psw !== psw){ // 密码错误
    res.status(511).send(handleRes.handleRes(511, ''))
  } else {
      let token = createToken({userName, psw})
      const resObj = {
        token,
        uid: result[1][0].userId,
        userName: result[1][0].userId,
      }
      res.status(200).send(handleRes.handleRes(200, resObj))
  }
  res.end()
});

module.exports = router;