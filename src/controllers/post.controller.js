// import post from "../models/post.model.js";
// import { deleteImg, uploadImg } from "../services/storage.service.js";

// const createPost = async (req, res) => {

//     try {
//         console.log(req.body, "check body request===");
//         const { title, content } = req.body;
//         const userId = req.user.id;
//         console.log(userId, "checking user id");


//         // 1. Validate first
//         if (!title || !content || !req.file) {
//             return res.status(400).json({
//                 message: "All fields are required!"
//             });
//         }

//         // 2. Upload image
//         const uplodCheck = await uploadImg(req.file, 'posts');

//         if (!uplodCheck || !uplodCheck.secure_url) {
//             return res.status(500).json({
//                 message: "Image upload failed!"
//             });
//         }

//         // 3. Create post
//         const posts = await post.create({
//             title,
//             content,
//             userId,
//             image: uplodCheck.secure_url,
//             public_id: uplodCheck.public_id
//         });

//         return res.status(201).json({
//             message: "Post created successfully!",
//             posts
//         });

//     } catch (error) {
//         console.log(error, "Error in creating post:", error.message, error.stack);

//         return res.status(500).json({
//             message: "Server error"
//         });
//     }
// };

// const deletePost = async (req, res) => {
//     const { id } = req.params
//     try {
//         const find = await post.findById(id)
//         if (find == null) {
//             return res.status(404).json({ status: false, message: 'post not found' })
//         }
//         const dltpostImg = await deleteImg(find.public_id)
//         console.log('dlt--->', dltpostImg);
//         const delePost = await post.findByIdAndDelete(id)
//         console.log('result in deleting data-->', delePost);

//         if (delePost == null) {
//             return res.status(404).json({ status: false, message: 'post not found' })
//         }
//         return res.status(200).json({ status: false, message: 'SUCCESSFULLY DELETEED' })

//     } catch (error) {
//         return res.status(400).json({ status: false, message: error.message })
//     }
// }

// const getAllPost = async (req, res) => {
//     const getPost = await post.find()
//         .populate("userId", "username image")
//         .sort({ createdAt: -1 });

//     res.status(200).json({
//         message: "fetched success",
//         getPost
//     })
// }

// const getMyPost = async (req, res) => {
//     const { id } = req.params
//     const myPost = await post.find({ userId: req.user.id })
//         .populate("userId", "username image")
//         .sort({ createdAt: -1 });

//     res.status(200).json({
//         message: "Post Fetched succussfully",
//         myPost
//     })
// }
// export { createPost, deletePost, getAllPost, getMyPost };



import post from "../models/post.model.js";
import { deleteImg, uploadImg } from "../services/storage.service.js";
import CATEGORIES from "../constants/categories.js";

// Helper: content ke words count se estimated read time nikalna (avg 200 words/min)
const calculateReadTime = (content) => {
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 500);
    return minutes < 1 ? 1 : minutes;
};

const createPost = async (req, res) => {

    try {
        console.log(req.body, "check body request===");
        const { title, content, shortDescription, category } = req.body;
        const userId = req.user.id;
        console.log(userId, "checking user id");


        // 1. Validate first
        if (!title || !content || !shortDescription || !category || !req.file) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        if (!CATEGORIES.includes(category)) {
            return res.status(400).json({
                message: `Category must be one of: ${CATEGORIES.join(", ")}`
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
            shortDescription,
            category,
            userId,
            image: uplodCheck.secure_url,
            public_id: uplodCheck.public_id,
            estimatedReadTime: calculateReadTime(content)
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

// Get single post by ID + increment view count
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const singlePost = await post.findById(id)
            .populate("userId", "username image");

        if (!singlePost) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (req.user && req.user.id) {
            const alreadyViewed = singlePost.viewedBy.some(
                (uid) => uid.toString() === req.user.id
            );

            if (!alreadyViewed) {
                singlePost.viewedBy.push(req.user.id);
                singlePost.views += 1;
                await singlePost.save();
            }
        } else {
            singlePost.views += 1;
            await singlePost.save();
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            post: singlePost
        });

    } catch (error) {
        console.log(error, "Error fetching single post");
        return res.status(500).json({ message: "Server error" });
    }
};

// ===== NEW: Get posts by category =====
const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!CATEGORIES.includes(category)) {
            return res.status(400).json({
                message: `Category must be one of: ${CATEGORIES.join(", ")}`
            });
        }

        const posts = await post.find({ category })
            .populate("userId", "username image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });

    } catch (error) {
        console.log(error, "Error fetching posts by category");
        return res.status(500).json({ message: "Server error" });
    }
};

// ===== NEW: Get the static category list (for frontend dropdown/filters) =====
const getCategories = async (req, res) => {
    return res.status(200).json({ categories: CATEGORIES });
};

// ===== NEW: Toggle like/unlike on a post =====
const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const singlePost = await post.findById(id);
        if (!singlePost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = singlePost.likes.some(
            (uid) => uid.toString() === userId
        );

        if (alreadyLiked) {
            // unlike
            singlePost.likes = singlePost.likes.filter(
                (uid) => uid.toString() !== userId
            );
        } else {
            // like
            singlePost.likes.push(userId);
        }

        singlePost.likeCount = singlePost.likes.length;
        await singlePost.save();

        return res.status(200).json({
            message: alreadyLiked ? "Post unliked" : "Post liked",
            liked: !alreadyLiked,
            likeCount: singlePost.likeCount
        });

    } catch (error) {
        console.log(error, "Error toggling like");
        return res.status(500).json({ message: "Server error" });
    }
};

// ===== NEW: Track how long someone read a post =====
// Frontend har post-open session ke end pe (page leave / tab close / timer) duration (seconds) bhejega
const trackReadTime = async (req, res) => {
    try {
        const { id } = req.params;
        const { duration } = req.body; // seconds

        if (!duration || duration <= 0) {
            return res.status(400).json({ message: "Valid duration is required" });
        }

        const singlePost = await post.findById(id);
        if (!singlePost) {
            return res.status(404).json({ message: "Post not found" });
        }

        singlePost.totalReadDuration += duration;
        singlePost.readSessionsCount += 1;
        singlePost.avgReadDuration = Number(
            (singlePost.totalReadDuration / singlePost.readSessionsCount).toFixed(1)
        );

        await singlePost.save();

        return res.status(200).json({
            message: "Read time recorded",
            avgReadDuration: singlePost.avgReadDuration
        });

    } catch (error) {
        console.log(error, "Error tracking read time");
        return res.status(500).json({ message: "Server error" });
    }
};

export {
    createPost,
    deletePost,
    getAllPost,
    getMyPost,
    getPostById,
    getPostsByCategory,
    getCategories,
    toggleLike,
    trackReadTime
};