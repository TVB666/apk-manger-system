/*
 * @Descripttion: 获取apk列表
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-15 00:49:30
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-16 07:39:18
 */
var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")

const list = []
const length = 135;
for (let index = 1; index < length; index++) {
  const startTime = new Date().getTime() + index * 1000;
  const endTime = startTime + 3 * 60 * 60 * 1000;
  const version = index;
  const describe = `我是描述${index}`;
  const user = `张三的第${index}个女儿`;
  const applicationName = '格力+'
  const obj = {
    startTime,
    endTime,
    version,
    describe,
    user,
    applicationName
  }
  list.push(obj)
}

const data = {
  code: 200,
  msg: 'ok',
  // result: list
}

router.get("/getApkList", function (req, res) {
  const token = req.headers.token
  const tokenResult = tokenMethods.verifyToken(token)
  if (!tokenResult.success) {
    const data = {
      code: 501,
      msg: tokenResult.message,
      result: {}
    }
    res.send(JSON.stringify(data))
    res.end();
  } else {
    if (JSON.stringify(req.query) == '{}') {
      const result = {
        total: length,
        total_pages: Math.ceil(length / 10),
        data: list.slice(0, 10),
        page: 1,
        limit: 10,
      }
      data.result = result
      res.send(JSON.stringify(data))
      res.end();
      return;
    }

    const {
      page,
      limit
    } = req.query
    console.log('page', page, 'limit', limit);

    // if(typeof page !== 'number' ||   typeof limit !== 'number'){
    //   res.send(JSON.stringify({code: 500, msg: 'page or number is not number type', result: null}))
    //   res.end();
    // }

    if (limit > length) {
      res.send(JSON.stringify({
        code: 500,
        msg: 'limit > total',
        result: null
      }))
      res.end();
    }
    const startIndex = (page - 1) * limit

    const arrList = list.slice(startIndex, startIndex + (limit >> 0))

    const result = {
      total: length,
      total_pages: Math.ceil(length / 10),
      data: arrList,
      page,
      limit
    }
    data.result = result
    res.send(data)
    res.end();
  }

})

module.exports = router;