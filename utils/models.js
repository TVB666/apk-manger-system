/*
 * @Descripttion: 数据库格式
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-24 21:41:44
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-28 01:53:18
 */ 
var mongoose=require('mongoose');
module.exports = {
	user:{
		userName:{type:String},
    userId:{type:Number, required:true},
    psw:{type:String},     
    createTime: {type:Date},  // 创建时间
    manager: {type:Number}, // 管理级别 0最低
    checkerId: {type:Number}, // 创建者id
    account: {type:String}, // 账户名
	},
  ApkInfo:{
    createdAt: {type: Number},
    userId: {type: Number, require: true},  //使用者
    userName: {type:String},
    version: {type:String, require: true}, // 预约版本
    describe: {type: String}, // 描述
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
    checkerId: {type:Number}, // 审批人
  },
  idSequence: {
    id_key: {type:String, require: true},  // 查询id 的唯一key值
    sequence_value: {type:Number}
  }
};
