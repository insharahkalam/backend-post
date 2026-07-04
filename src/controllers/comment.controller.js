import comment from "../models/comment.model.js";
import post from "../models/post.model.js";

// Add a comment on a post
const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const postExists = await post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await comment.create({
            postId,
            userId,
            text
        });

        const populatedComment = await newComment.populate("userId", "username image");

        return res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        console.log(error, "Error adding comment");
        return res.status(500).json({ message: "Server error" });
    }
};

// Get all comments for a post
const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await comment.find({ postId })
            .populate("userId", "username image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        });

    } catch (error) {
        console.log(error, "Error fetching comments");
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete a comment (only the owner can delete)
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingComment = await comment.findById(id);
        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (existingComment.userId.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own comment" });
        }

        await comment.findByIdAndDelete(id);

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.log(error, "Error deleting comment");
        return res.status(500).json({ message: "Server error" });
    }
};

export { addComment, getCommentsByPost, deleteComment };