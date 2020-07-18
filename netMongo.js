/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-16 22:36:20
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-17 07:43:12
 */
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://127.0.0.1:27017"

MongoClient.connect(url, {
  useUnifiedTopology: true
}, function (err, db) {
  if (err) throw err;
  // console.log('创建完成');
  var dbBase = db.db("apkManagerSystem");
  // 创建库 必须写入点数据，否则创建不成功 createCollection
  // dbBase.createCollection('use', function (err, res) {
  //   if (err) throw err;
  //   console.log("创建集合!");
  // });

  // 写入数据C 连接哭 collection 单条 insertOne  多条 insertMany  
  // var useObj = [
  //   {name: 'WJR', id: "560165", psw: "WJR560155", creatTime: 1595047745480 },
  //   {name: 'ZH', id: "560177", psw: "ZH560177", creatTime: 1598047745480 },
  // ]
  // dbBase.collection("use").insertMany(useObj, function(err, res){
  //   if(err) throw err
  //   console.log('插入成功');
  //   db.close
  // })

  // 查询数据 R  find
  // var whereStr = {"name":'LZH'};  // 查询条件
  // dbBase.collection("use").find(whereStr).toArray(function (err, ressult) {
  //   if (err) throw err;
  //   console.log(ressult);
  //   dbBase.close
  // })

  // 更新数据 U  updateOne(只变更找到的第一条) updateMany(变更找到的全部) 注意新数据要加 {$set: {}} result.nModified 为更新的条数
  // var whereStr = {"id":'560178933'};  
  // var updataStr = {$set:{ "name": 'LZ<' }}
  // // dbBase.collection('use').updateOne(whereStr, updataStr, function(err, ressult){
  // dbBase.collection('use').updateMany(whereStr, updataStr, function(err, ressult){
  //   if(err) throw err
  //   console.log(ressult);
  //   console.log('更新成功'+ ressult.result.nModified + "条");
  //   db.close()
  // })


  // 删除 D  result.n 删除的条数
  var whereStr = {"name":'CWZ'};  
  dbBase.collection('use').deleteOne(whereStr, function(err, result){
    if(err) throw err
    console.log("文档删除成功");
    db.close()
  })
})