/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-20 21:38:14
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-23 01:37:41
 */ 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

// for(var m in models){ 
// 	mongoose.model(m, new Schema(models[m], { collection: "user"}));
// }

mongoose.model("user", new Schema(models.user, { collection: "user"}));
mongoose.model("Order", new Schema(models.Order, { collection: "orderList"}));
mongoose.model("ApkInfo", new Schema(models.Order, { collection: "apkList"}));

module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
	}
};

var _getModel = function(type){ 
	return mongoose.model(type);
};