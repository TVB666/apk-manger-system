/*
 * @Descripttion: 返回结果处理
 * @version: 1.0
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-20 23:57:16
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-23 02:17:24
 */
const codeObj = {
  200: 'ok',
  201: '您已经绑定过该版本号了',
  400: '请选择要上传的文件！',
  501: '糟糕，认证已过期，请重新登录！',
  502: '数据非法',
  510: '用户不存在',
  511: '密码错误',
  512: '版本不存在',
  513: '该地址找不到文件',
  514: '该版本已被他人使用',
  515: '请求参数缺失'
}

const orderStatus = {
  0: '未使用',
  1: '预约使用中',
  2: '待审核',
  3: '已完成'
}

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