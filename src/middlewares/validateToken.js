import jwt from 'jsonwebtoken'

export const validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1]
    // console.log("Incoming token:", token);
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