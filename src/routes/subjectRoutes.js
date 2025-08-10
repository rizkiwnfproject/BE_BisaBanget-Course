import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { subjectSchema } from '../utils/schema.js'
import { validateToken } from '../middlewares/validateToken.js'
import {
    createSubject,
    deleteSubject,
    getSubject,
    getSubjectById,
    updateSubject,
    detailSubjectWithTeachers,
    getTeacherSubjects
} from '../controllers/subjectController.js'

const subjectRoutes = express.Router()

// admin

// membuat subject
subjectRoutes.post('/subject', validateToken, validateRequest(subjectSchema), createSubject)
// melihat semua subject
subjectRoutes.get('/subject', validateToken, getSubject)
// mengupdate subject
subjectRoutes.put('/subject/:id', validateToken, validateRequest(subjectSchema), updateSubject)
// menghapus subject
subjectRoutes.delete('/subject/:id', validateToken, deleteSubject)

// melihat subject berdasarkan ID
subjectRoutes.get('/subject/:id', validateToken, getSubjectById)


// mendapatkan detail subject beserta guru dan kelas yang diajar
subjectRoutes.get('/my-detail-subject/:id', validateToken, detailSubjectWithTeachers)

// teacher
subjectRoutes.get('/my-subject', validateToken, getTeacherSubjects)


export default subjectRoutes


// subjectRoutes.get('/subject', validateToken, getSubjectWithTeachers)