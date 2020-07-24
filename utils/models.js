var mongoose=require('mongoose');
module.exports = {
	user:{
		userName:{type:String,required:true},
    userId:{type:Number},
    psw:{type:String},
    createTime: {type:Date},
    manager: {type:Number}
	},
  ApkInfo:{
    userId: {type: Number, require: true},
    // userName: {type:String},
    version: {type:String, require: true},
    createTime: { type: Date, default: Date.now },
    bingTime: {type: Date},
    overTime: {type: Date},
    finishTime: {type: Date},
    orderStatus:  {type: Number},
    orderId:{type:Number},
    platformType:{type:String},
    url: {type:String},
    checkerId: {type:Number}
  }
};
