/*
 * @Descripttion: 登录
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-15 22:30:20
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-16 07:35:44
 */ 
var { checkToken , createToken } = require("../utils/token")

var express = require("express");
var md5 = require("js-md5");
var router  = express.Router();

const username = "WJR"
const psw = "test123456"
const md5psw = md5(md5(psw))

//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicHN3IjoiNTBkZGQ4YWRlM2Y3MDg3NDdiYzdiZmI1YzMxZWNhMWUiLCJydGllbSI6IjIwMjAtMDctMTVUMTQ6NTU6MDEuMzMyWiIsImV4cCI6NzIwMDAwMCwiaWF0IjoxNTk0ODI0OTAxfQ.-rY-s90R5YQCyoT-pQxu_S18jzo3b6_VBVnYrCKOoLw

router.get('/login', function(req, res) {
  let token = createToken({username, psw: md5psw});
  const User = global.dbHandel.getModel('user');
  var whereStr = {"name":username};  // 查询条件
  User.create({
    name: username,
    psw: md5psw,
    token,
  }, function(err, result){
    if(err) throw err
    console.log('写入成功');
    console.log(result);
  })
  const result = {
    token,
  }
  const data = {
    code: 200,
    msg: 'ok',
    result,
  }
  res.send(JSON.stringify(data))
  res.end();
  // checkToken(req.headers.Authorization).then(res=>{
  //         //token验证成功
  //         //判断过期时间
  //     }).catch(err=>{
  //         res.json({err:-1,msg:'token非法'})
  //     })
});

// if(true){
//   let token = createToken({username, psw: md5psw});
//   res.json({err:0,msg:'OK',token});
// }else{
//   res.json({err:-1,msg:'fail'});
// }

module.exports = router;