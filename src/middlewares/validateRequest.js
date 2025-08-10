import { ZodError } from "zod";

export const validateRequest = (schema) => async (req, res, next) => {
    try {
        schema.parse(req.body);
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.issues.map((error => error.message))
            console.log(errorMessage)
            return res.status(500).json({
                error: "Invalid Request",
                detail: errorMessage
            })
        }
        return res.status(500).json({
            message: "Internal Server Error"
        })

    }
}