/*
 * @Descripttion: 数据库格式
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-24 21:41:44
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-27 11:33:15
 */ 
var mongoose=require('mongoose');
module.exports = {
	user:{
		userName:{type:String,required:true},
    userId:{type:Number},
    psw:{type:String},     
    createTime: {type:Date},  // 创建时间
    manager: {type:Number}, // 管理级别 0最低
    checkerId: {type:Number}, // 创建者id
	},
  ApkInfo:{
    userId: {type: Number, require: true},  //使用者
    version: {type:String, require: true}, // 预约版本
    createTime: { type: Date, default: Date.now }, // 订单创建时间
    fixTime: {type: Date}, // 修改时间
    overTime: {type: Date}, // 超期时间
    uploadTime: {type: Date}, // 文件上传时间
    checkTime: {type: Date}, // 审批时间
    finishTime: {type: Date}, // 完成时间
    orderStatus:  {type: Number}, // 订单状态
    orderId:{type:Number}, // 订单id
    platformType:{type:Number}, // 平台
    url: {type:String}, // 文件路径
    checkerId: {type:Number} // 审批人
  }
};
