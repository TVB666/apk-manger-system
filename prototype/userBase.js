import BaseDao from './BaseDao'
import UserSchema from '../models/user'

class UserComponent extends BaseDao {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  // 登录
  async login(req, res, next) {
    console.log('--login--', req.body);
    const {
      account,
      psw
    } = req.body
    if (!account || !psw) {
      this.sendRes(res, 515)
      res.end()
      return;
    }

    const admin = await UserSchema.findOne({account})
    if (!admin) {
      this.sendRes(res, 510)
      return
    } else if (admin.psw !== psw) {
      this.sendRes(res, 511)
    } else {
      let resObj = {
        token: this.createToken({
          account,
          psw
        }),
        userId: admin.userId,
        _id: admin._id,
        userName: admin.userName,
        account: admin.account,
        manager: admin.manager,
      }
      this.sendRes(res, 200, resObj)
    }
    res.end()
  }

  //TODO 删除 添加 退出登录 ===
}


export default new UserComponent()