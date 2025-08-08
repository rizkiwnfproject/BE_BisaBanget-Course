import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY_JWT, { expiresIn: '1d' })
}