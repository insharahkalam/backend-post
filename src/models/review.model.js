import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    timestamps: true
});

// Ek user, ek post pe sirf ek review de sakta hai
reviewSchema.index({ postId: 1, userId: 1 }, { unique: true });

const review = mongoose.model("reviews", reviewSchema);
export default review;