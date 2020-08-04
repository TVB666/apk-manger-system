import BaseDao from './BaseDao'
import User from '../models/user'

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
      res.status(515).send(this.handleRes(515))
      res.end()
      return;
    }

    const admin = await User.findOne({account})
    if (!admin) {
      res.status(510).send(this.handleRes(510))
      return
    } else if (admin.psw !== psw) {
      res.status(511).send(this.handleRes(511))
    } else {
      let resObj = {
        token: this.createToken({
          account,
          psw
        }),
        userId: admin.userId,
        userName: admin.userName,
        account: admin.account,
        manager: admin.manager,
      }
      res.status(200).send(this.handleRes(200, resObj))
    }
    res.end()
  }

  //TODO 删除 添加 退出登录 ===
}


export default new UserComponent()