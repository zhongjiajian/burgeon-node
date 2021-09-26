import { getJWTPayload } from '@/common/Utils'
import Page from '@/model/Page'

class PageController {
  // 新建页面
  async addPage (ctx) {
    const obj = await getJWTPayload(ctx.header.authorization)
    const { body } = ctx.request
    const page = new Page({
      uid: obj._id,
      title: body.title,
      note: body.note,
      isDel: false
    })
    const result = await page.save()
    ctx.body = {
      code: 200,
      msg: '创建成功',
      data: result
    }
  }

  // 删除页面
  async deletePage (ctx) {
    await getJWTPayload(ctx.header.authorization)
    const { body } = ctx.request
    const result = await Page.updateOne({ _id: body.id }, { $set: { isDel: true } })
    ctx.body = {
      code: 200,
      data: result,
      msg: '删除成功'
    }
  }

  // 更新页面
  async updatePage (ctx) {
    await getJWTPayload(ctx.header.authorization)
    const { body } = ctx.request
    const result = await Page.updateOne({ _id: body.id }, { $set: { content: body.content } })
    ctx.body = {
      code: 200,
      data: result,
      msg: '更新成功'
    }
  }
}

export default new PageController()
