import mongoose from "mongoose"

export default function connectDatabase() {
    const DATABASE_URL = process.env.DATABASE_URL
    try {
        mongoose.connect(DATABASE_URL)
            .then(() => console.log("MongoDB is  connected successfully"))
            .catch((err) => console.log(err))
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}