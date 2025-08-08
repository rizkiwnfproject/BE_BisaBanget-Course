import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createSubject, deleteSubject, getSubject, updateSubject } from '../controllers/subjectController.js'
import { subjectSchema } from '../utils/schema.js'
import { validateToken } from '../middlewares/validateToken.js'


const subjectRoutes = express.Router()

subjectRoutes.post('/subject', validateToken, validateRequest(subjectSchema), createSubject)
subjectRoutes.get('/subject', validateToken, getSubject)
subjectRoutes.put('/subject/:id', validateToken, validateRequest(subjectSchema), updateSubject)
subjectRoutes.delete('/subject/:id', validateToken, deleteSubject)

export default subjectRoutes