import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { signInSchema, signUpSchema } from '../utils/schema.js'
import { createUser, getUserLogin, signInUser } from '../controllers/authController.js'
import { validateToken } from '../middlewares/validateToken.js'

const authRoutes = express.Router()

authRoutes.post('/sign-up', validateRequest(signUpSchema), createUser)
authRoutes.post('/sign-in', validateRequest(signInSchema), signInUser)
authRoutes.get('/user', validateToken, getUserLogin)

export default authRoutes