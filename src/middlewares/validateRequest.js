import { ZodError } from "zod";

export const validateRequest = (schema) => async (req, res, next) => {
    console.log("percobaan 1")
    try {
        schema.parse(req.body);
        // const validated = schema.parse(req.body);
        // req.body = validated;
        // console.log(validated)
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