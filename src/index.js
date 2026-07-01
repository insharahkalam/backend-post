import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/db.js'
import router from './router/post.router.js'
import cors from 'cors'
import authRoute from './router/auth.router.js'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'https://frontend-post-smoky.vercel.app']
}))
connectDB()

app.use('/api/auth', authRoute)
app.use('/api/posts', router)

app.get("/", (req, res) => {
    res.json({
        message: "Server is running on port 3000"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`server is runnning on port ${process.env.PORT}`);

})
