import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

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

    category: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

const post = mongoose.model("posts", postSchema);
export default post;