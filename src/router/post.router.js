// import express from 'express'
// import { createPost, deletePost, getAllPost, getMyPost } from '../controllers/post.controller.js'
// import multer from 'multer'
// import authMiddleware from '../middleware/authMiddleware.js'

// const upload = multer({ storage: multer.memoryStorage() })

// const router = express.Router()

// router.post('/create', authMiddleware, upload.single("image"), createPost)
// router.delete('/delete/:id', deletePost)
// router.get('/getAllPost', getAllPost)
// router.get('/getMyPost/:id', authMiddleware, getMyPost)



// export default router


import express from 'express'
import {
    createPost,
    deletePost,
    getAllPost,
    getMyPost,
    getPostById,
    getPostsByCategory,
    getCategories,
    toggleLike,
    trackReadTime
} from '../controllers/post.controller.js'
import multer from 'multer'
import authMiddleware from '../middleware/authMiddleware.js'
import optionalAuth from '../middleware/optionalAuth.js'

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/create', authMiddleware, upload.single("image"), createPost)
router.delete('/delete/:id', deletePost)
router.get('/getAllPost', getAllPost)
router.get('/getMyPost/:id', authMiddleware, getMyPost)

// Single post (view count ke sath, guest ya logged-in dono ke liye)
router.get('/getPost/:id', optionalAuth, getPostById)

// ===== NEW ROUTES =====
router.get('/categories', getCategories)                      // static category list
router.get('/category/:category', getPostsByCategory)         // posts filtered by category
router.post('/like/:id', authMiddleware, toggleLike)           // like / unlike toggle
router.post('/trackRead/:id', trackReadTime)                   // log a reading session duration

export default router