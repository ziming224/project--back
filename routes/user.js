import { Router } from 'express'
import * as user from '../controllers/user.js'
import * as auth from '../middlewares/auth.js'

const router = Router()

router.post('/', user.create)
router.post('/login', auth.login, user.login)
router.get('/profile', auth.token, user.profile)
router.patch('/refresh', auth.token, user.refresh)
router.delete('/logout', auth.token, user.logout)

export default router
