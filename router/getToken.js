var express = require("express")
var router = express.Router()
var tokenMethods = require("../utils/token")

router.get("/getToken", function (req, result) {
  console.log('req', req.headers.token);
  const token = req.headers.token
  const tokenResult = tokenMethods.verifyToken(token)
  console.log('tokenResult', tokenResult);
  result.send(tokenResult)
  console.log('----------');

}); 

module.exports = router;