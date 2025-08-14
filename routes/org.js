import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as org from '../controllers/org.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.get('/', org.get)
router.get('/all', auth.token, auth.admin, org.getAll)
router.get('/:id', org.getId)
router.post('/', auth.token, auth.admin, upload, org.create)

router.patch('/:id', auth.token, auth.admin, upload, org.update)

export default router
