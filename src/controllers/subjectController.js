import classModel from '../models/classModel.js'
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
                message: 'Hanya Admin yang dapat membuat Pelajaran'
            })
        }

        const subject = await subjectModel.create({ name: body.name })
        return res.status(201).json({
            message: "Pelajaran Sukses Dibuat",
            data: subject
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Membuat Data Pelajaran'
        })
    }
}

export const getSubject = async (req, res) => {
    try {
        const id = req.user.id
        const user = await userModel.findById(id)

        if (user.role !== "admin") {
            return res.status(404).json({
                message: "Hanya Admin yang dapat membuat Pelajaran",
            })
        }

        const subject = await subjectModel.find()
        if (subject.length === 0 || !subject) {
            return res.status(200).json({
                message: "Data pelajaran Kosong",
                data: subject
            })
        }
        return res.status(200).json({
            message: "Berhasil Mendapatkan Semua Data Pelajaran",
            data: subject
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Mendapatkan Data Pelajaran'
        })
    }
}

export const getSubjectById = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user.id
        const user = await userModel.findById(userId)

        // if (user.role !== "admin") {
        //     return res.status(404).json({
        //         message: "You only can see your taught subject",
        //     })
        // }

        const subject = await subjectModel.findById(id)
        if (subject.length === 0 || !subject) {
            return res.status(200).json({
                message: "Data pelajaran Kosong",
                data: []
            })
        }
        return res.status(200).json({
            message: "Berhasil Mendapatkan Semua Data Pelajaran Berdasarkan ID",
            data: subject
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Mendapatkan Data Pelajaran Berdasarkan ID'
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
                message: 'Hanya Admin yang dapat membuat Pelajaran'
            })
        }

        await subjectModel.findByIdAndUpdate(id, {
            name: body.name
        })

        const subjectUpdate = await subjectModel.findById(id)
        return res.status(200).json({
            message: 'Pelajaran Sukses Diubah',
            data: subjectUpdate
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal Mengubah Data Pelajaran'
        })
    }
}

export const deleteSubject = async (req, res) => {
    try {
        const id = req.params.id
        const user = req.user
        const isUser = await userModel.findOne().where('_id').equals(user.id)

        if (isUser.role !== "admin") {
            return res.status(403).json({
                message: 'Hanya Admin yang dapat membuat Pelajaran'
            })
        }

        const subject = await subjectModel.findByIdAndDelete(id)
        const classes = await classModel.find({ 'subjects.subjectId': id })

        if (classes !== null || classes.length !== 0) {
            await classModel.updateMany(
                { 'subjects.subjectId': id },
                { $pull: { subjects: { subjectId: id } } }
            )
        }
        return res.status(200).json({
            message: 'Pelajaran Sukses Dihapus',
            data: subject
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal Menghapus Data Pelajaran',
        })
    }
}

export const detailSubjectWithTeachers = async (req, res) => {
    try {
        const subjectId = req.params.id

        const subjects = await classModel.find({ 'subjects.subjectId': subjectId }).select('name').populate('subjects.subjectId subjects.teacherId')

        if (subjects === null || subjects.length === 0) {
            return res.status(404).json({
                message: 'Subject Tidak Ditemukan',
                data: []
            })
        }

        const subjectArray = []
        subjects.forEach(sub => {
            sub.subjects.forEach(subj => {
                if (subj.subjectId.equals(subjectId)) {
                    subjectArray.push({
                        className: sub.name,
                        subjectName: subj.subjectId.name,
                        teacherName: subj.teacherId.name
                    })
                }
            })
        })

        return res.status(200).json({
            message: 'Subject Ditemukan Beserta Pengajarnya',
            data: subjectArray
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const getTeacherSubjects = async (req, res) => {
    try {
        const userId = req.user.id
        const isUser = await userModel.findOne().where('_id').equals(userId)

        if (isUser.role !== "teacher") {
            return res.status(403).json({
                message: 'Hanya Guru Yang Dapat Melihat Kelas'
            })
        }

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
