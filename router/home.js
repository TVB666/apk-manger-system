/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-15 08:09:15
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-15 20:05:18
 */ 
var express = require("express")
var router = express.Router()

router.get("", function (req, res) {
  res.send("小伙子, 干的不错啊,发现了隐藏接口");
  res.end();
}); 

module.exports = router;