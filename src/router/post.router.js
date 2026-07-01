import express from 'express'
import { createPost, deletePost, getAllPost, getMyPost } from '../controllers/post.controller.js'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/create', upload.single("image"), createPost)
router.delete('/delete/:id', deletePost)
router.get('/getAllPost', getAllPost)
router.get('/getMyPost/:id', getMyPost)



export default router