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
                message: 'Hanya Admin Yang Dapat Membuat Kelas'
            })
        }

        const isAdmin = await userModel.findOne().where('_id').equals(body.classAdvisorId)
        if (isAdmin.role === "admin") {
            return res.status(404).json({
                message: 'Hanya Guru Yang Dapat Menjadi Wali'
            })
        }

        if (body.subject === null) {
            for (const item of body.subjects) {
                const subject = await subjectModel.findById(item.subjectId)
                const teacher = await userModel.findById(item.teacherId)

                if (teacher === null) {
                    return res.status(404).json({
                        message: 'Data Guru Tidak Ada'
                    })
                }

                if (teacher.role !== "teacher") {
                    return res.status(403).json({
                        message: 'Hanya Guru Yang Dapat Mengajar Kelas'
                    })
                }

                if (!subject || !teacher || subject === null || teacher === null) {
                    return res.status(403).json({
                        message: 'Pelajaran Atau Guru Tidak Ditemukan'
                    })
                }
            }
        }

        const newClass = await classModel.create(body)
        return res.status(201).json({
            message: "Berhasil Membuat Data Kelas",
            data: newClass
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Membuat Data Kelas'
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
                message: "Data Kelas Kosong",
                data: []
            })
        }
        return res.status(200).json({
            message: "Berhasil Mendapatkan Seluruh Data Kelas",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Mendapatkan Data Kelas'
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
                message: "Data Kelas Kosong",
                data: []
            })
        }

        return res.status(200).json({
            message: "Berhasil Mendapatkan Data Kelas Berdasarkan ID",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Mendapatkan Data Kelas Berdasarkan ID'
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
                message: 'Hanya Admin Yang Dapat Mengupdate Kelas'
            })
        }
        
        const isAdmin = await userModel.findOne().where('_id').equals(body.classAdvisorId)
        if (isAdmin.role === "admin") {
            return res.status(404).json({
                message: 'Hanya Guru Yang Dapat Menjadi Wali'
            })
        }

        for (const item of body.subjects) {
            const subject = await subjectModel.findById(item.subjectId)
            const teacher = await userModel.findById(item.teacherId)

            if (teacher.role !== "teacher") {
                return res.status(403).json({
                    message: 'Hanya Guru Yang Dapat Mengajar Kelas'
                })
            }

            if (!subject || !teacher || subject === null || teacher === null) {
                return res.status(403).json({
                    message: 'Pelajaran Atau Guru Tidak Ditemukan'
                })
            }
        }

        const updateClasses = await classModel.findByIdAndUpdate(id, body)
        return res.status(201).json({
            message: "Berhasil Mengupdate Data Kelas",
            data: updateClasses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Mengubah Data Kelas'
        })
    }
}

export const deleteClass = async (req, res) => {
    try {
        const id = req.params.id
        const classes = await classModel.findByIdAndDelete(id)
        return res.status(201).json({
            message: "Berhasil Menghapus Kelas",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Menghapus Data Kelas'
        })
    }
}

export const getClassByClassAdvisor = async (req, res) => {
    try {
        const id = req.user.id
        const isUser = await userModel.findOne().where('_id').equals(id)

        if (isUser.role !== "teacher") {
            return res.status(403).json({
                message: 'Hanya Guru Yang Dapat Melihat Kelas Yang DiWali'
            })
        }

        const classes = await classModel.find().where('classAdvisorId').equals(id)
            .select('_id name description')
            .populate('classAdvisorId', 'name')
            .populate('subjects.subjectId', 'name')
            .populate('subjects.teacherId', 'name')

        if (!classes || classes.length === 0 || classes === null) {
            return res.status(200).json({
                message: "Tidak Ada Kelas Yang Diwali",
                data: []
            });
        }

        return res.status(200).json({
            message: "Mendapatkan Data Kelas Sesuai Kelas Yang DiWali",
            data: classes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Gagal Mendapatkan Kelas'
        })
    }
}

export const getTeacherClass = async (req, res) => {
    try {
        const userId = req.user.id
        const isUser = await userModel.findOne().where('_id').equals(userId)

        if (isUser.role !== "teacher") {
            return res.status(403).json({
                message: 'Hanya Guru Yang Dapat Melihat Kelas Yang Diajar',
                data: []
            })
        }

        const classes = await classModel.find({ 'subjects.teacherId': isUser._id })
            .populate('classAdvisorId', 'name email')
            .populate('subjects.subjectId', 'name')
            .populate('subjects.teacherId', 'name email');

        if (!classes || classes.length === 0 || classes === null) {
            return res.status(200).json({
                message: 'Kelas Guru Tidak Ditemukan',
                data: []
            })
        }
        return res.json({
            message: 'Kelas Guru Ditemukan',
            data: classes
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Gagal mengambil Guru Beserta Kelas',
            error: error.message
        })
    }
}