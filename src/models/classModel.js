import mongoose from "mongoose"

const classModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Your name is required"]
    },
    description: {
        type: String,
        required: [true, "Your description is required"]
    },
    classAdvisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Your class advisor is required"]
    },
    subjects: [
        {
            subjectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
            teacherId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ]
}, { timestamps: true })

export default mongoose.model("Class", classModel)