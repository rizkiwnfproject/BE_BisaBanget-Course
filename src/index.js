import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'

import connectDatabase from './utils/database.js'
import router from './routes/allRoutes.js'

dotenv.config();

// memanggil ekspress
const app = express()

const port = process.env.PORT

// memanggil koneksi DB
connectDatabase()

// memperbolehkan dari domain lain
app.use(cors())
// mengubah dari req body ke object js
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: 'Ini Backend BisaBanget Course' })
})

app.use('/api', router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
