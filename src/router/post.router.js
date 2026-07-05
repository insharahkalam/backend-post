import express from 'express'
import { createPost, deletePost, getAllPost, getMyPost, getPostById } from '../controllers/post.controller.js'
import multer from 'multer'
import authMiddleware from '../middleware/authMiddleware.js'

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/create', authMiddleware, upload.single("image"), createPost)
router.delete('/delete/:id', deletePost)
router.get('/getAllPost', getAllPost)
router.get('/getMyPost/:id', authMiddleware, getMyPost)
router.get('/getOnePost/:id', getPostById)

export default router