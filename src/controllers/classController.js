import classModel from '../models/classModel.js'
import subjectModel from '../models/subjectModel.js'
import userModel from '../models/userModel.js'

export const createClass = async (req, res) => {
    try {
        const body = req.body
        const user = req.user
        const isUser = await userModel.findOne().where('_id').equals(user.id)

        if (isUser.role !== "admin") {
            return res.status(403).json({
                message: 'Only Admin Can Create Class'
            })
        }

        for (const item of body.subjects) {
            const subject = await subjectModel.findById(item.subjectId)
            const teacher = await userModel.findById(item.teacherId)

            if (teacher.role !== "teacher") {
                return res.status(403).json({
                    message: 'Only Teacher Can Teach Class'
                })
            }

            if (!subject || !teacher || subject === null || teacher === null) {
                return res.status(403).json({
                    message: 'Subject/Teacher cant find'
                })
            }
        }

        const newClass = await classModel.create(body)
        return res.status(201).json({
            message: "Create Class Success",
            data: newClass
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Create Class'
        })
    }
}

export const getClass = async (req, res) => {
    try {
        const classes = await classModel.find()
            .select('name description')
            .populate('classAdvisorId', 'name')
            .populate('subjects.subjectId', 'name')
            .populate('subjects.teacherId', 'name')

        if (classes.length === 0 || !classes) {
            return res.status(200).json({
                message: "Class Empty",
                data: classes
            })
        }
        return res.status(200).json({
            message: "Get All Class Success",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Get Class'
        })
    }
}

export const getClassById = async (req, res) => {
    try {
        const id = req.params.id
        const classes = await classModel.findById(id)
            .select('name description')
            .populate('classAdvisorId', 'name')
            .populate('subjects.subjectId', 'name')
            .populate('subjects.teacherId', 'name')

        if (classes.length === 0 || !classes) {
            return res.status(200).json({
                message: "Class Empty",
                data: classes
            })
        }
        return res.status(200).json({
            message: "Get Class By Id Success",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Get Class By Id'
        })
    }
}

export const updateClass = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const user = req.user
        const isUser = await userModel.findOne().where('_id').equals(user.id)

        if (isUser.role !== "admin") {
            return res.status(403).json({
                message: 'Only Admin Can Update Class'
            })
        }

        for (const item of body.subjects) {
            const subject = await subjectModel.findById(item.subjectId)
            const teacher = await userModel.findById(item.teacherId)

            if (teacher.role !== "teacher") {
                return res.status(403).json({
                    message: 'Only Teacher Can Teach Class'
                })
            }

            if (!subject || !teacher || subject === null || teacher === null) {
                return res.status(403).json({
                    message: 'Subject/Teacher cant find'
                })
            }
        }

        const updateClasses = await classModel.findByIdAndUpdate(id, body)
        return res.status(201).json({
            message: "Update Class Success",
            data: updateClasses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Update Class'
        })
    }
}


export const deleteClass = async (req, res) => {
    try {
        const id = req.params.id
        const classes = await classModel.findByIdAndDelete(id)
        return res.status(201).json({
            message: "Delete Class Success",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Delete Class'
        })
    }
}