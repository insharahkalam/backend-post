import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/db.js'
import router from './router/post.router.js'
dotenv.config()

const app = express()
app.use(express.json())
connectDB()

app.use('/api/posts', router)

app.listen(process.env.PORT, () => {
    console.log(`server is runnning on port ${process.env.PORT}`);

})
