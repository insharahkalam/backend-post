// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     image: {
//         type: String,
//         required: true
//     },
//     public_id: {
//         type: String
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users",
//         required: true
//     }

// }, {
//     timestamps: true
// })
// const post = mongoose.model('posts', postSchema)
// export default post


import mongoose from "mongoose";
import CATEGORIES from "../constants/categories.js";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    // ===== NEW: short + long description (jaisa UI cards me dikhta hai) =====
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },
    public_id: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    // ===== NEW: category (Technology / Culture / Science / Business / Design / Environment) =====
    category: {
        type: String,
        required: true,
        enum: CATEGORIES
    },

    // ===== Views =====
    views: {
        type: Number,
        default: 0
    },
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],

    // ===== Reviews / Ratings =====
    avgRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // ===== NEW: Likes =====
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    likeCount: {
        type: Number,
        default: 0
    },

    // ===== NEW: Read time tracking =====
    // estimatedReadTime: content ke words count se automatic calculate hota hai (createPost me)
    estimatedReadTime: {
        type: Number, // minutes me
        default: 1
    },
    // totalReadDuration + readSessionsCount se avgReadDuration nikalta hai (kitni der log actually padhte hain)
    totalReadDuration: {
        type: Number, // seconds me
        default: 0
    },
    readSessionsCount: {
        type: Number,
        default: 0
    },
    avgReadDuration: {
        type: Number, // seconds me
        default: 0
    }

}, {
    timestamps: true
});

const post = mongoose.model("posts", postSchema);
export default post;