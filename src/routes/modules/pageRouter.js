import Router from 'koa-router'
import pageController from '@/api/PageController'

const router = new Router()

router.prefix('/page')

// 新建页面
router.post('/addPage', pageController.addPage)

// 删除页面
router.post('/deletePage', pageController.deletePage)

// 修改页面
router.post('/updatePage', pageController.updatePage)

export default router
