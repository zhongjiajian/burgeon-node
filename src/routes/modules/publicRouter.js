import Router from 'koa-router'
import publicController from '@/api/PublicController'

const router = new Router()

router.prefix('/public')

// 获取图片验证码
router.get('/getCaptcha', publicController.getCaptcha)

// 获取页面列表
router.post('/getPages', publicController.getPages)

// 获取页面信息
router.post('/getPageInfo', publicController.getPageInfo)

export default router
