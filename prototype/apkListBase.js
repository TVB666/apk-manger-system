import BaseDao from './BaseDao'
import ApkListSchema from '../models/apkList'

class ApkListComponent extends BaseDao {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.hasCorrectToken = this.hasCorrectToken.bind(this);
  }

  hasCorrectToken(req, res) {
    const token = req.headers.token
    const tokenResult = this.checkToken(token)
    if (!tokenResult.success) {
      res.status(501).send(handleRes.handleRes(501, ''))
      res.end();
      return;
    }
    return true
  }

  // 获取列表
  async getList(req, res, next) {
    console.log('-----getList---------', req.query);

    const tokenRes = hasCorrectToken(req, res)
    if (!tokenRes) return

    const apkList = await ApkListSchema.find()
    const length = apkList.length
    let {
      page = 1, 
      limit = 10
    } = req.query
    page = page >> 0
    limit = limit >> 0

    const startIndex = (page - 1) * limit
    const arrList = apkList.slice(startIndex, startIndex + (limit >> 0))
    const result = {
      total: length,
      total_pages: Math.ceil(length / 10),
      data: arrList,
      page: page >> 0,
      limit: limit >> 0
    }
    res.status(200).send(this.handleRes(200, result))
    res.end();
  }

  //TODO 
}


export default new ApkListComponent()