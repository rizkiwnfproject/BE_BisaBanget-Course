import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
    signInSchema,
    signUpSchema
} from '../utils/schema.js'
import {
    registerUser,
    getAllUser,
    getUserLogin,
    loginUser,
    getTeacherDetail,
    assignClassSubject,
    detailTeachersWithSubject,
    getUserById
} from '../controllers/authController.js'
import { validateToken } from '../middlewares/validateToken.js'

const authRoutes = express.Router()

authRoutes.post('/sign-up', validateRequest(signUpSchema), registerUser)
authRoutes.post('/sign-in', validateRequest(signInSchema), loginUser)

authRoutes.get('/user', validateToken, getUserLogin)
authRoutes.get('/users', validateToken, getAllUser)
authRoutes.get('/user/:id', validateToken, getUserById)


// ketika membuka buka detail guru dengan membawa id guru, maka akan terlihat kalau guru ini mengajar kelas dan pelajaran apa aja. 
// authRoutes.get('/teacher-detail/:id', validateToken, getTeacherDetail)

// mendapatkan detail gutu beserta guru dan kelas yang diajar
authRoutes.get('/teacher-detail/:id', validateToken, detailTeachersWithSubject)

// saat setelah membuat kelas, kan pastinya memasukkan guru, nah ini bisa untuk memasukkan guru setelah kelas selesai dibuat
authRoutes.post('/teacher/:id/assign-class-subject', validateToken, assignClassSubject)


export default authRoutes