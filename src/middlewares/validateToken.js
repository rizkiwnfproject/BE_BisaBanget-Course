import jwt from 'jsonwebtoken'

export const validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1]

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(404).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}