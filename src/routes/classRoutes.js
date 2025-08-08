import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { classSchema } from '../utils/schema.js'
import { validateToken } from '../middlewares/validateToken.js'
import { createClass, deleteClass, getClass, getClassById, updateClass } from '../controllers/classController.js'


const classRoutes = express.Router()

classRoutes.post('/class', validateToken, validateRequest(classSchema), createClass)
classRoutes.get('/class', validateToken, getClass)
classRoutes.put('/class/:id', validateToken, validateRequest(classSchema), updateClass)
classRoutes.get('/class/:id', validateToken, getClassById)
classRoutes.delete('/class/:id', validateToken, deleteClass)

export default classRoutes