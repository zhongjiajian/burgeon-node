import { getJWTPayload } from '@/common/Utils'
import Page from '@/model/Page'
import PageProd from '@/model/PageProd'

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

  // 发布页面
  async publishPage (ctx) {
    await getJWTPayload(ctx.header.authorization)
    const { body } = ctx.request
    const stablePage = await Page.findByPid(body.id, true)
    if (!stablePage.prodId) {
      const pageProd = new PageProd({
        uid: stablePage.uid,
        title: stablePage.title,
        note: stablePage.note,
        content: stablePage.content
      })
      const prodResult = await pageProd.save()
      const stableResult = await Page.updateOne({ _id: body.id }, { $set: { prodId: prodResult._id } })
      if (stableResult.ok) {
        ctx.body = {
          code: 200,
          data: Object.assign(stablePage, { prodId: prodResult._id }),
          msg: '发布成功'
        }
      }
    } else {
      const prodResult = await PageProd.updateOne({ _id: stablePage.prodId }, { $set: { content: stablePage.content } })
      if (prodResult.ok) {
        ctx.body = {
          code: 200,
          data: stablePage,
          msg: '发布成功'
        }
      }
    }
    // const result = await Page.updateOne({ _id: body.id }, { $set: { content: body.content } })
  }
}

export default new PageController()
