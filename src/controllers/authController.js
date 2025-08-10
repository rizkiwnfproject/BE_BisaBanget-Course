import classModel from '../models/classModel.js'
import userModel from '../models/userModel.js'
import { createToken } from '../utils/token.js'
import bcrypt from 'bcrypt'

export const registerUser = async (req, res) => {
    try {
        const body = req.body
        const hashPassword = bcrypt.hashSync(body.password, 12)

        const user = new userModel({
            name: body.name,
            email: body.email,
            password: hashPassword,
            role: "teacher",
        })

        await user.save()
        return res.status(201).json({
            message: "Sukses Registrasi",
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Registrasi'
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const body = req.body
        const isUser = await userModel.findOne().where('email').equals(body.email)
        const comparePassword = bcrypt.compareSync(body.password, isUser.password)
        const token = createToken(isUser._id)

        if (!isUser) {
            return res.status(400).json({
                message: "User Tidak Ditemukan",
            })
        }
        if (!comparePassword) {
            return res.status(400).json({
                message: "Password Salah",
            })
        }

        return res.status(200).json({
            message: "Sukses Log In",
            data: {
                name: isUser.name,
                email: isUser.email,
                role: isUser.role,
                token
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Log In'
        })
    }
}

export const getUserLogin = async (req, res) => {
    try {
        const user = req.user
        const body = await userModel.findOne().where('_id').equals(user.id)
        return res.json({
            message: 'User berhasil ditemukan',
            user,
            data: body,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal mengambil user login',
            error: error.message
        })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const user = await userModel.find()
        return res.json({
            message: 'Semua Data User berhasil diambil',
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal mengambil Semua Data User',
            error: error.message
        })
    }
}


export const getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                message: 'Tidak Ada Pengguna',
                data: []
            })
        }
        return res.status(200).json({
            message: 'Berhasil Mendapatkan Data User Berdasarkan ID',
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal mengambil Data User Berdasarkan ID',
            error: error.message
        })
    }
}

export const getTeacherDetail = async (req, res) => {
    try {
        const userId = req.params.id
        const classes = await classModel.find({ 'subjects.teacherId': userId })
            .populate('subjects.subjectId', 'name')
            .populate('subjects.teacherId', 'name email');

        if (!classes || classes.length === 0 || classes === null) {
            return res.status(200).json({
                message: 'Pelajaran Guru Tidak Ditemukan',
                data: []
            })
        }

        const subjectsArray = []
        classes.forEach(cls => {
            cls.subjects.forEach(sub => {
                if (String(sub.teacherId._id) === String(userId)) {
                    subjectsArray.push({
                        className: cls.name,
                        subjectName: sub.subjectId.name
                    })
                }
            })
        })

        return res.json({
            message: 'Pelajaran Guru Ditemukan',
            data: subjectsArray
        })
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mengambil Guru Beserta Pelajaran', error: error.message })
    }
}

// assign teachert to class
export const assignClassSubject = async (req, res) => {
    const teacherId = req.params.id
    console.log(teacherId)

    const { classId, subjectId } = req.body

    try {
        const teacher = await userModel.findById(teacherId)
        if (!teacher || teacher.role !== "teacher") {
            return res.status(400).json({ message: "Invalid teacher" })
        }

        // Tambahkan ke subjects[] di Class
        const updatedClass = await classModel.findByIdAndUpdate(
            classId,
            { $push: { subjects: { subjectId, teacherId } } },
            { new: true }
        ).populate("subjects.subjectId subjects.teacherId")

        res.json(updatedClass)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


export const detailTeachersWithSubject = async (req, res) => {
    try {
        const teacherId = req.params.id

        const teachers = await classModel.find({ 'subjects.teacherId': teacherId }).select('name').populate('subjects.subjectId subjects.teacherId')

        if (teachers === null || teachers.length === 0) {
            return res.status(200).json({
                message: 'Guru Tidak Ditemukan',
                data: []
            })
        }

        const teacherArray = []
        teachers.forEach(t => {
            t.subjects.forEach(ts => {
                if (ts.teacherId.equals(teacherId)) {
                    teacherArray.push({
                        className: t.name,
                        subjectName: ts.subjectId.name,
                        teacherName: ts.teacherId.name
                    })
                }
            })
        })

        return res.status(200).json({
            message: 'Guru Ditemukan Beserta Pelajarannya',
            data: teacherArray
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

