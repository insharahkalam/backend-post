import express from 'express'
import { createPost } from '../controllers/post.controller.js'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/create', upload.single("image"), createPost)
    



export default router