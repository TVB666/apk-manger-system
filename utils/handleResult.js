/*
 * @Descripttion: 返回结果处理
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-20 23:57:16
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-27 20:57:52
 */
// code 大全
const codeObj = {
  200: 'ok',
  201: '您已经绑定过该版本号了',
  400: '请选择要上传的文件！',
  501: '糟糕，认证已过期，请重新登录！',
  502: '数据非法',
  510: '用户不存在',
  511: '密码错误',
  512: '版本不存在',
  513: '文件不存在',
  514: '该版本已被他人使用',
  515: '请求参数缺失',
  516: '无权限操作',
  517: '该订单不存在'
}

// 列表状态
const orderStatus = {
  0: '未使用',
  1: '预约使用中',
  2: '待审核',
  3: '待修改',
  4: '已完成'
}

// 平台
const platformType = {
  0: '格力+',
  1: 'Gree+'
}

// 返回的数据处理
function handleRes(code, res) {
  const obj = {
    code,
    msg: codeObj[code],
    res
  }
  return JSON.stringify(obj)
}



module.exports = {
  handleRes,
  codeObj
}