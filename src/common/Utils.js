import { getValue } from '@/config/RedisConfig'
import config from '../config/index'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import moment from 'dayjs'

const getJWTPayload = token => {
  try {
    return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
  } catch (error) {
    throw new Error(error)
  }
}

// 生成 token 返回给客户端
const generateToken = (payload, expire = '1h') => {
  if (payload) {
    return jwt.sign({
      ...payload
    }, config.JWT_SECRET, { expiresIn: expire })
  } else {
    throw new Error('生成token失败！')
  }
}

// 判断一个日期是否是今天
export const isToday = _date => {
  if (_date) {
    return moment(_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
  }
  return false
}

const checkCode = async (key, value) => {
  const redisData = await getValue(key)
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

// 验证短信或者邮箱验证码
export const checkRedisAccountCode = async (accout, sms) => {
  const redisData = await getValue(accout)
  if (redisData) {
    const data = JSON.parse(redisData)
    return moment().isBefore(moment(data.expire)) && (sms === data.sms)
  }
  return false
}

const getStats = (path) => {
  return new Promise((resolve) => {
    // fs.stats(path, (err, stats) => {
    //   if (err) {
    //     resolve(false)
    //   } else {
    //     resolve(stats)
    //   }
    // })
    fs.stat(path, (err, stats) => err ? resolve(false) : resolve(stats))
  })
}

const mkdir = (dir) => {
  return new Promise((resolve) => {
    fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
  })
}

const dirExists = async (dir) => {
  const isExists = await getStats(dir)
  // 如果该路径存在且不是文件，返回 true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    // 路径存在，但是是文件，返回 false
    return false
  }
  // 如果该路径不存在
  const tempDir = path.parse(dir).dir
  // 循环遍历，递归判断如果上级目录不存在，则产生上级目录
  const status = await dirExists(tempDir)
  if (status) {
    const result = await mkdir(dir)
    console.log('TCL: dirExists -> result', result)
    return result
  } else {
    return false
  }
}

const rename = (obj, key, newKey) => {
  if (Object.keys(obj).indexOf(key) !== -1) {
    obj[newKey] = obj[key]
    delete obj[key]
  }
  return obj
}

const sortObj = (arr, property) => {
  return arr.sort((m, n) => m[property] - n[property])
}

const sortMenus = (tree) => {
  tree = sortObj(tree, 'sort')
  if (tree.children && tree.children.length > 0) {
    tree.children = sortMenus(tree.children, 'sort')
  }
  if (tree.operations && tree.operations.length > 0) {
    tree.operations = sortMenus(tree.operations, 'sort')
  }
  return tree
}

const getMenuData = (tree, rights, flag) => {
  const arr = []
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    // _id 包含在menus中
    // 结构进行改造，删除opertaions
    if (rights.includes(item._id + '') || flag) {
      if (item.type === 'menu') {
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            hideInBread: item.hideInBread,
            hideInMenu: item.hideInMenu,
            notCache: item.notCache,
            icon: item.icon
          },
          component: item.component,
          children: getMenuData(item.children, rights)
        })
      } else if (item.type === 'link') {
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            icon: item.icon,
            href: item.link
          }
        })
      }
    }
  }

  return sortObj(arr, 'sort')
}

const flatten = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

const getRights = (tree, menus) => {
  let arr = []
  for (let item of tree) {
    if (item.operations && item.operations.length > 0) {
      for (let op of item.operations) {
        if (menus.includes(op._id + '')) {
          arr.push(op.path)
        }
      }
    } else if (item.children && item.children.length > 0) {
      arr.push(getRights(item.children, menus))
    }
  }
  return flatten(arr)
}

const rand = (len = 8) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < len; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const getTempName = () => {
  return 'toimc_' + rand() + '@toimc.com'
}

// 生成一个随机的用户名
// const getTempName = () => {
//   return 'toimc_' + Math.random().toString(36).slice(2) + Math.floor(Math.random() * 10000)
// }

export {
  checkCode,
  getJWTPayload,
  generateToken,
  getTempName,
  dirExists,
  rename,
  getMenuData,
  sortMenus,
  flatten,
  getRights,
  rand
}
