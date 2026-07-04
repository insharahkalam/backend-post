import review from "../models/review.model.js";
import post from "../models/post.model.js";

// Helper: recalculate a post's average rating
const recalcAvgRating = async (postId) => {
    const reviews = await review.find({ postId });
    const totalReviews = reviews.length;
    const avgRating = totalReviews
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    await post.findByIdAndUpdate(postId, {
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews
    });
};

// Add or update a review (one review per user per post)
const addOrUpdateReview = async (req, res) => {
    try {
        const { postId } = req.params;
        const { rating, reviewText } = req.body;
        const userId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const postExists = await post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Upsert: agar review pehle se hai to update, warna naya bana do
        const savedReview = await review.findOneAndUpdate(
            { postId, userId },
            { rating, reviewText },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        await recalcAvgRating(postId);

        return res.status(200).json({
            message: "Review saved successfully",
            review: savedReview
        });

    } catch (error) {
        console.log(error, "Error saving review");
        return res.status(500).json({ message: "Server error" });
    }
};

// Get all reviews for a post
const getReviewsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const reviews = await review.find({ postId })
            .populate("userId", "username image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Reviews fetched successfully",
            reviews
        });

    } catch (error) {
        console.log(error, "Error fetching reviews");
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete a review (only the owner can delete)
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingReview = await review.findById(id);
        if (!existingReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (existingReview.userId.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own review" });
        }

        const postId = existingReview.postId;
        await review.findByIdAndDelete(id);
        await recalcAvgRating(postId);

        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        console.log(error, "Error deleting review");
        return res.status(500).json({ message: "Server error" });
    }
};

export { addOrUpdateReview, getReviewsByPost, deleteReview };