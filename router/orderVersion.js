var express = require("express");
var router = express.Router();
var tokenMethods = require("../utils/token")

// 预约版本
router.get('/orderVersion', function (req, res) {
  console.log('req', req.body);
  const {
    useId,
    version,
    platformType
  } = req.body
  
  res.send('~~~')
  res.end()
});

module.exports = router