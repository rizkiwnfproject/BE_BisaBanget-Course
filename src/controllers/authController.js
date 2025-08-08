import userModel from '../models/userModel.js'
import { createToken } from '../utils/token.js'
import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
    try {
        const body = req.body
        const hashPassword = bcrypt.hashSync(body.password, 12)

        const user = new userModel({
            name: body.name,
            email: body.email,
            password: hashPassword,
            role: body.role,
        })

        await user.save()
        return res.status(201).json({
            message: "Create User Success",
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const signInUser = async (req, res) => {
    try {
        const body = req.body
        const isUser = await userModel.findOne().where('email').equals(body.email)
        const comparePassword = bcrypt.compareSync(body.password, isUser.password)
        const token = createToken(isUser._id)

        if (!isUser) {
            return res.status(400).json({
                message: "User Not Found",
            })
        }
        if (!comparePassword) {
            return res.status(400).json({
                message: "Password False",
            })
        }

        return res.status(200).json({
            message: "Success Sign In",
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
            message: 'Internal server error'
        })
    }
}

export const getUserLogin = async (req, res) => {
    try {
        const user = req.user
        const body = await userModel.findOne().where('_id').equals(user.id)
        res.json({
            message: 'User berhasil ditemukan',
            user,
            data: body
        })
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil user login', error: error.message })
    }
}
