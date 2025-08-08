import subjectModel from '../models/subjectModel.js'
import userModel from '../models/userModel.js'

export const createSubject = async (req, res) => {
    try {
        const body = req.body
        const user = req.user
        const isUser = await userModel.findOne().where('_id').equals(user.id)
        console.log(isUser);

        if (isUser.role !== "admin") {
            return res.status(403).json({
                message: 'Only Admin Can Create Subject'
            })
        }

        const subject = await subjectModel.create({ name: body.name })

        await subject.save()
        return res.status(201).json({
            message: "Create Subject Success",
            data: subject
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Create Subject'
        })
    }
}

export const getSubject = async (req, res) => {
    try {
        const subject = await subjectModel.find()

        if (subject.length === 0 || !subject) {
            return res.status(200).json({
                message: "Subject Empty",
                data: subject
            })
        }
        return res.status(200).json({
            message: "Get All Subject Success",
            data: subject
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed to Get Subject'
        })
    }
}

export const updateSubject = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const user = req.user
        const isUser = await userModel.findOne().where('_id').equals(user.id)
        console.log(isUser);

        if (isUser.role !== "admin") {
            return res.status(403).json({
                message: 'Only Admin Can Update Subject'
            })
        }

        await subjectModel.findByIdAndUpdate(id, {
            name: body.name
        })

        const subjectUpdate = await subjectModel.findById(id)
        return res.status(200).json({
            message: 'Update Subject Success',
            data: subjectUpdate
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to Update Subject'
        })
    }
}

export const deleteSubject = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body

        const subject = await subjectModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: 'Delete Subject Success',
            data: subject
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to Delete Subject',
        })
    }
}