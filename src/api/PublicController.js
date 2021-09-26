import svgCaptcha from 'svg-captcha'
import { setValue } from '@/config/RedisConfig'
import Page from '@/model/Page'

class PublicController {
  // 获取图片验证码
  async getCaptcha (ctx) {
    const body = ctx.query
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0oO1ilLI',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38
    })
    if (typeof body.sid === 'undefined') {
      ctx.body = {
        code: 500,
        msg: '参数不全！'
      }
      return
    }
    // 保存图片验证码数据，设置超时时间，单位: s
    // 设置图片验证码超时10分钟
    setValue(body.sid, newCaptca.text, 10 * 60)
    ctx.body = {
      code: 200,
      data: newCaptca.data
    }
  }

  // 获取页面列表
  async getPages (ctx) {
    const result = await Page.getList(ctx.request.body, 'created')

    ctx.body = {
      code: 200,
      data: result,
      msg: '获取成功'
    }
  }

  // 获取页面信息
  async getPageInfo (ctx) {
    const { body } = ctx.request
    const result = await Page.findByPid(body.id)
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取成功'
    }
  }
}

export default new PublicController()
