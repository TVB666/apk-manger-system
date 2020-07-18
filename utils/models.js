var mongoose=require('mongoose');
module.exports = {
	user:{
		name:{type:String,required:true},
    phone:{type:Number},
    useId:{type:Number},
		psw:{type:String,required:true},
		token:{type:String,required:true},
	},

};
