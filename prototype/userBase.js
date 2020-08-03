import BaseDao from './BaseDao'
import UserModel from '../models/user'

class UserComponent extends BaseDao {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

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
    const aa = `${account}` 
    console.log('-account--------------', aa);
    const admin = await UserModel.findOne({"account": aa})
    console.log('----admin----', admin );
    
    if (!admin) {
      res.status(510).send(this.handleRes(510))
      return
    } else if (admin.psw !== psw) {
      res.status(511).send(handleRes.handleRes(511))
    }else{
      let resObj = {
        token: this.createToken({account, psw}),
        userId: admin.userId,
        userName: admin.userName,
        account: admin.account,
        manager: admin.manager,
      }
      res.status(200).send(handleRes.handleRes(200, resObj))
    }
    res.end()
  }
}

export default new UserComponent()