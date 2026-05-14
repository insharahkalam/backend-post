import post from "../models/post.model.js";

const createPost = async (req, res) => {
    const { title, content, image } = req.body
    console.log(title, content, image, "check===>");

    if (!title || !content || !image) {
        return res.status(400).json({
            message: "All field required!"
        })
    }

    const posts = await post.create({ title, content, image })
    res.status(200).json({
        message: "Post created successfully!",
        posts
    })
}

export { createPost }