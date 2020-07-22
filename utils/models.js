var mongoose=require('mongoose');
module.exports = {
	user:{
		userName:{type:String,required:true},
    useId:{type:String},
    psw:{type:String},
	},
  Order: {
    version: {type:String},
    userName: {type:String},
    createTime: {type: Number},
    overTime: {type: Number},
    finishTime: {type: Number},
    userId: {type: Number},
    orderStatus:  {type: Number},
    orderId:{type:Number},
    platformType:{type:String},
  },
  ApkInfo:{
    userId: {type: Number},
    userName: {type:String},
    version: {type:String},
    createTime: {type: Number},
    overTime: {type: Number},
    finishTime: {type: Number},
    orderStatus:  {type: Number},
    orderId:{type:Number},
    platformType:{type:String},
    url: {type:String},
    checkerId: {type:Number}
  }
};
