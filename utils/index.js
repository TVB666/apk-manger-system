// code 大全
const codeObj = {
  200: 'ok',
  201: '您已经绑定过该版本号了',
  400: '请上传apk文件！',
  501: '糟糕，认证已过期，请重新登录！',
  502: '数据非法',
  510: '用户不存在',
  511: '密码错误',
  512: '版本不存在',
  513: '文件不存在',
  514: '该版本已被他人使用',
  515: '请求参数缺失',
  516: '无权限操作',
  517: '该预约号不存在',
  518: '该单号非审批状态',
  519: '取消了下载或服务器异常',
  520: '文件类型不是apk',
  521: '文件大小不符合要求'
}

// 列表状态
const orderStatus = {
  ENUM_unable: 0, //'未使用'
  ENUM_order_use: 1, //'预约使用中'
  ENUM_to_audit: 2, //'待审核'
  ENUM_to_modify : 3, //'待修改'
  ENUM_has_been: 4, //'已完成'
  ENUM_upload_ing: 5, //'上传中'
  ENUM_upload_err: 6, //'上传失败'
}

// 订单操作类型
const operatTypeENUM = {
  ENUM_agree: 1, //'同意'
  ENUM_rejected: 2, //'驳回'
  ENUM_delete: 3, //'删除'
}

// 平台
const platform = {
  0: 'domestic',  //格力
  1: 'overseas', //  Gree
  ENUM_domestic: 0,
  ENUM_overseas: 1,
}

// 返回的数据处理
function handleRes(code, res = '') {
  if(code === 500){
    console.log('--error--', res);
  }
  const obj = {
    code,
    msg: codeObj[code],
    res
  }
  return JSON.stringify(obj)
}

export {
  handleRes,
  codeObj,
  platform,
  orderStatus,
  operatTypeENUM
}
