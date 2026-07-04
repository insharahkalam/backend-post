import express from "express";
import { addComment, getCommentsByPost, deleteComment } from "../controllers/comment.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add/:postId", authMiddleware, addComment);
router.get("/getByPost/:postId", getCommentsByPost);
router.delete("/delete/:id", authMiddleware, deleteComment);

export default router;