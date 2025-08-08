import mongoose from "mongoose"

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Your name is required"]
    },
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Your password address is required"]
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "teacher"
    },
}, { timestamps: true })

export default mongoose.model("User", userModel)