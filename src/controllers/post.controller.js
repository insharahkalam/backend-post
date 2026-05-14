import post from "../models/post.model.js";
import cloudinary from "../services/storage.service.js";

const createPost = async (req, res) => {

    console.log("check", req.body);
    console.log("check", req.file);

    const result = await cloudinary.uploader.upload(req.file.path)
    console.log(req.file.path)

    console.log(result, 'result check');
    console.log(result.secure_url);



    // const { title, content, image } = req.body
    // console.log(title, content, image, "check===>");

    // if (!title || !content || !image) {
    //     return res.status(400).json({
    //         message: "All field required!"
    //     })
    // }

    // const posts = await post.create({ title, content, image })
    // res.status(200).json({
    //     message: "Post created successfully!",
    //     posts
    // })
}

export { createPost }