import bcrypt from 'bcrypt'
import { checkCode, generateToken } from '@/common/Utils'
import User from '@/model/User'

class LoginController {
  // 用户登录
  async login (ctx) {
    // 接收用户的数据
    // 返回token
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    if (body.sid === undefined) {
      ctx.body = {
        code: 401,
        msg: 'sid参数不能为空'
      }
      return
    }
    const result = await checkCode(sid, code)
    if (result) {
      // 验证用户账号密码是否正确
      let checkUserPasswd = false
      const user = await User.findOne({ username: body.username })
      if (user === null) {
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
        return
      }
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPasswd = true
      }
      // mongoDB查库
      if (checkUserPasswd) {
        // 验证通过，返回Token数据
        const userObj = user.toJSON()
        const arr = ['password', 'username']
        arr.map((item) => {
          return delete userObj[item]
        })
        ctx.body = {
          code: 200,
          data: userObj,
          token: generateToken({ _id: user._id }, '60m'),
          refreshToken: generateToken({ _id: user._id }, '7d')
        }
      } else {
        // 用户名 密码验证失败，返回提示
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查！'
      }
    }
  }

  // refreshToken
  async refresh (ctx) {
    ctx.body = {
      code: 200,
      token: generateToken({ _id: ctx._id }),
      msg: '获取token成功'
    }
  }
}

export default new LoginController()
