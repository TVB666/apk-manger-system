/*
 * @Descripttion: 后端api
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-13 22:16:53
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-15 00:48:13
 */ 
var express  = require("express");
var router   = express.Router();



const list = []
for (let index = 1; index < 11; index++) {
  const startTime = new Date().getTime() + index * 1000;
  const overTime = startTime + 3 * 60 * 60 * 1000;
  const version = index;
  const describe = `我是描述${index}`;
  const user = `张三的第${index}个女儿`;
  const obj = {startTime,overTime,version,describe,user}
  list.push(obj)
}

const data = {
  code: 200,
  msg: 'ok',
  result: list
}

router.get("/getApkList", function(req, res){
  res.send(JSON.stringify(data))
  res.end();
})



module.exports = router;