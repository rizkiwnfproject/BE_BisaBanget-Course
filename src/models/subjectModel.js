import mongoose from "mongoose"

const subjectModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Your subject name is required"]
    },
}, { timestamps: true })

export default mongoose.model("Subject", subjectModel)