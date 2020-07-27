/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-20 21:38:14
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-28 01:26:35
 */ 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

// for(var m in models){ 
// 	mongoose.model(m, new Schema(models[m], { collection: "user"}));
// }

mongoose.model("user", new Schema(models.user, { collection: "user"}));
mongoose.model("ApkInfo", new Schema(models.ApkInfo, { collection: "apkList"}));
mongoose.model("idSequence", new Schema(models.idSequence, { collection: "idSequence"}));

// 自加一
const getNextSequenceValue = async (sequenceName) =>{
  var sequenceDocument = await mongoose.model('idSequence').findOneAndUpdate(
    {"id_key": sequenceName },
    {$inc:{sequence_value:1}},
    {new: true})
  return sequenceDocument.sequence_value;
}

module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
  },
  "getNextSequenceValue": getNextSequenceValue,
};

var _getModel = function(type){ 
	return mongoose.model(type);
};


 