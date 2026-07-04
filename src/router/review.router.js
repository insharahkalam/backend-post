import express from "express";
import { addOrUpdateReview, getReviewsByPost, deleteReview } from "../controllers/review.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add/:postId", authMiddleware, addOrUpdateReview);
router.get("/getByPost/:postId", getReviewsByPost);
router.delete("/delete/:id", authMiddleware, deleteReview);

export default router;