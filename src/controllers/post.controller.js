import post from "../models/post.model.js";
import { uploadImg } from "../services/storage.service.js";

const createPost = async (req, res) => {

    try {

        const { title, content } = req.body;

        // 1. Validate first
        if (!title || !content || !req.file) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        // 2. Upload image
        const uplodCheck = await uploadImg(req.file);

        if (!uplodCheck || !uplodCheck.secure_url) {
            return res.status(500).json({
                message: "Image upload failed!"
            });
        }

        // 3. Create post
        const posts = await post.create({
            title,
            content,
            image: uplodCheck.secure_url,
            public_id: uplodCheck.public_id
        });

        return res.status(201).json({
            message: "Post created successfully!",
            posts
        });

    } catch (error) {
        console.log(error, "error in creating post");

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export { createPost };