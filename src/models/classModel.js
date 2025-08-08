import mongoose from "mongoose"

const classModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Your name is required"]
    },
    description: {
        type: String,
        required: [true, "Your email address is required"]
    },
    classAdvisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: [true, "Your class advisor is required"]
    },
    subjects:[
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
                required: [true, "Your subject is required"]
            },
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: [true, "Your teacher is required"]
            },
        }
    ]
}, { timestamps: true })

export default mongoose.model("Class", classModel)