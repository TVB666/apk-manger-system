/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-16 22:36:20
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-27 21:03:09
 */
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://127.0.0.1:27017"
var md5 = require("js-md5");

MongoClient.connect(url, {
  useUnifiedTopology: true
}, function (err, db) {
  if (err) throw err;
  // console.log('创建完成');
  var dbBase = db.db("apkManagerSystem");
  // 创建库 必须写入点数据，否则创建不成功 createCollection
  // dbBase.createCollection('test', function (err, res) {
  //   if (err) throw err;
  //   console.log("创建集合!");
  // });

  // 写入数据C 连接哭 collection 单条 insertOne  多条 insertMany  
  // var useObj = [
  //   {userName: 'adminnnn', userId: 10086666, psw: "14e1b600b1fd579f47433b88e8d85291", creatTime: new Date(), manager: 0 },
  // ]
  
    var useObj = [
      // {account: '560777', userName: '管理员小德', userId: 201, psw: md5(md5('345678')), creatTime: new Date().getTime(), manager: 1 , checkerId: 1},
      // {account: '560888', userName: '超级管理员null', userId: 1, psw: md5(md5('060100')), creatTime: new Date().getTime(), manager: 2 , checkerId: 0},
      {account: '560184', userName: '朤朤', userId: 203, psw: md5(md5('@WSX3edc')), creatTime: new Date().getTime(), manager: 2 , checkerId: 1},
    ]
    // dbBase.collection("test").createIndex({"creatTime": 1},{expireAfterSeconds: 10})
    dbBase.collection("user").insertMany(useObj, function(err, res){
      if(err) throw err
      console.log('插入成功');
      db.close
    })
    // var orderObj = [
    //   {userName: 'admin', userId: 10086, version: '1.0.1.0.1', createTime: new Date().getTime(), overTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 3, finishTime: '', orderId: 1, orderStatus: 0 },
    // ]
    // dbBase.collection("orderList").insertMany(orderObj, function(err, res){
    //   if(err) throw err
    //   console.log('插入成功');
    //   db.close
    // })
    // var orderObj = [
    //   {userName: 'admin', userId: 10086, version: '1.0.1.0.1', createTime: new Date().getTime(), overTime: new Date().getTime() + 1000 * 60 * 60 * 24 * 3, finishTime: '', orderId: 1, orderStatus: 0 },
    // ]
    // dbBase.collection("apkList").insertMany(orderObj, function(err, res){
    //   if(err) throw err
    //   console.log('插入成功');
    //   db.close
    // })


  // 查询数据 R  find
  // var whereStr = {"userName":'admin'};  // 查询条件
  // dbBase.collection("user").find(whereStr).toArray(function (err, ressult) {
  //   if (err) throw err;
  //   console.log(ressult);
  //   dbBase.close
  // })

  // 更新数据 U  updateOne(只变更找到的第一条) updateMany(变更找到的全部) 注意新数据要加 {$set: {}} result.nModified 为更新的条数
  // var whereStr = {"id":'560178933'};  
  // var whereStr = {"userName":'admin'};  
  // // var updataStr = {$set:{ "name": 'LZ<' }}
  // var updataStr = {$set:{ "account": '560666' }}
  // // dbBase.collection('use').updateOne(whereStr, updataStr, function(err, ressult){
  // dbBase.collection('user').updateMany(whereStr, updataStr, function(err, ressult){
  //   if(err) throw err
  //   console.log(ressult);
  //   console.log('更新成功'+ ressult.result.nModified + "条");
  //   db.close()
  // })


  // 删除 D  result.n 删除的条数
  // var whereStr = {"name":'CWZ'};  
  // dbBase.collection('use').deleteOne(whereStr, function(err, result){
  //   if(err) throw err
  //   console.log("文档删除成功");
  //   db.close()
  // })
})