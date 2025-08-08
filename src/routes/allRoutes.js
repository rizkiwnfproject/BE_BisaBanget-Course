import express from 'express'
import authRoutes from './authRoutes.js'
import subjectRoutes from './subjectRoutes.js'
import classRoutes from './classRoutes.js'

const router = express.Router()

router.use(authRoutes)
router.use(subjectRoutes)
router.use(classRoutes)

export default router