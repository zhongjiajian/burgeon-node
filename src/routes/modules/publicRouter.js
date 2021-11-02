import Router from 'koa-router'
import publicController from '@/api/PublicController'

const router = new Router()

router.prefix('/public')

// 获取图片验证码
router.get('/getCaptcha', publicController.getCaptcha)

// 获取页面列表-stable
router.post('/stable/getPages', publicController.getPages)

// 获取页面信息-stable
router.post('/stable/getPageInfo', publicController.getPageInfo)

// 获取页面列表-prod
router.post('/prod/getPages', publicController.getProdPages)

// 获取页面信息-prod
router.post('/prod/getPageInfo', publicController.getProdPageInfo)

export default router
