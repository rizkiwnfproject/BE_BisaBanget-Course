import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const createToken = (id) => {
    // console.log("Creating token for:", id)
    // console.log("Using secret:", process.env.SECRET_KEY_JWT ? "OK" : "MISSING")
    return jwt.sign({id}, process.env.SECRET_KEY_JWT, { expiresIn: '7d' })
}

