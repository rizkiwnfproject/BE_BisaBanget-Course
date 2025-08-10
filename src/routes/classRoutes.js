import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { classSchema } from '../utils/schema.js'
import { validateToken } from '../middlewares/validateToken.js'
import {
    createClass,
    deleteClass,
    getClass,
    getClassById,
    getClassByClassAdvisor,
    updateClass,
    getTeacherClass
} from '../controllers/classController.js'


const classRoutes = express.Router()

// digunakan untuk membuat kelas
classRoutes.post('/class', validateToken, validateRequest(classSchema), createClass)
// digunakan untuk mengambil semua kelas
classRoutes.get('/class', validateToken, getClass)
// digunakan untuk mengupdate kelas
classRoutes.put('/class/:id', validateToken, validateRequest(classSchema), updateClass)
// digunakan untuk menghapus kelas
classRoutes.delete('/class/:id', validateToken, deleteClass)

// mendapatkan Detail Class Berdasarkan id 
classRoutes.get('/class/:id', validateToken, getClassById)

// mendapatkan data list kelas yang diwali
classRoutes.get('/my-classes-advisor', validateToken, getClassByClassAdvisor)

// mendapatkan data Kelas Yang Diajar sesuai dengan subject yang diajar
classRoutes.get('/my-classes', validateToken, getTeacherClass)



export default classRoutes