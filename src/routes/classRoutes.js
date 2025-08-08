import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createSubject, deleteSubject, getSubject, updateSubject } from '../controllers/subjectController.js'
import { subjectSchema } from '../utils/schema.js'
import { validateToken } from '../middlewares/validateToken.js'


const classRoutes = express.Router()

classRoutes.post('/subject', validateToken, validateRequest(subjectSchema), createSubject)
classRoutes.get('/subject', validateToken, getSubject)
classRoutes.put('/subject/:id', validateToken, validateRequest(subjectSchema), updateSubject)
classRoutes.delete('/subject/:id', validateToken, deleteSubject)

export default classRoutes