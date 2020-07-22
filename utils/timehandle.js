/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-22 20:53:11
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-22 20:53:48
 */ 
function getymd(dateStr) {
  var d = new Date();
  var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  return resDate;
}