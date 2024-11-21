import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoute from './route/user.route.js'
import authRoute from './route/auth.route.js'
import postRoute from './route/post.route.js'
import commentRoute from './route/comment.route.js'

import { uploadFile } from './util/cloudinary.js' // Import your upload function
import { upload } from './middleware/multer.middleware.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

dotenv.config()

mongoose.connect(process.env.MONGO)
.then(() => console.log('DB Connected'))
.catch(err => console.error('Error connecting to DB:', err))

const __dirname = path.resolve()

const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// app.use(fileUpload())
// app.use(fileUpload({
//     limits: { fileSize: 10 * 1024 * 1024 }, // 4MB
// }))

app.listen(3000, () => {
    console.log("server is running on port 3000")
})

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.post('/api/upload', upload.single('imageFile'), uploadFile)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error'
    res
        .status(statusCode)
        .json({
            success: false,
            statusCode,
            message
        })
})