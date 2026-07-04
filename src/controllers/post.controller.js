import post from "../models/post.model.js";
import { deleteImg, uploadImg } from "../services/storage.service.js";

const createPost = async (req, res) => {

    try {
        console.log(req.body, "check body request===");
        const { title, content } = req.body;
        const userId = req.user.id;
        console.log(userId, "checking user id");


        // 1. Validate first
        if (!title || !content || !req.file) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        // 2. Upload image
        const uplodCheck = await uploadImg(req.file, 'posts');

        if (!uplodCheck || !uplodCheck.secure_url) {
            return res.status(500).json({
                message: "Image upload failed!"
            });
        }

        // 3. Create post
        const posts = await post.create({
            title,
            content,
            userId,
            image: uplodCheck.secure_url,
            public_id: uplodCheck.public_id
        });

        return res.status(201).json({
            message: "Post created successfully!",
            posts
        });

    } catch (error) {
        console.log(error, "Error in creating post:", error.message, error.stack);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params
    try {
        const find = await post.findById(id)
        if (find == null) {
            return res.status(404).json({ status: false, message: 'post not found' })
        }
        const dltpostImg = await deleteImg(find.public_id)
        console.log('dlt--->', dltpostImg);
        const delePost = await post.findByIdAndDelete(id)
        console.log('result in deleting data-->', delePost);

        if (delePost == null) {
            return res.status(404).json({ status: false, message: 'post not found' })
        }
        return res.status(200).json({ status: false, message: 'SUCCESSFULLY DELETEED' })

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }
}

const getAllPost = async (req, res) => {
    const getPost = await post.find()
        .populate("userId", "username image")
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "fetched success",
        getPost
    })
}

const getMyPost = async (req, res) => {
    const { id } = req.params
    const myPost = await post.find({ userId: req.user.id })
        .populate("userId", "username image")
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Post Fetched succussfully",
        myPost
    })
}
export { createPost, deletePost, getAllPost, getMyPost };