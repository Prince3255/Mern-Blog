import { errorHandler } from '../util/error.js'
import Post from '../model/post.model.js'

export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, 'You are not allowed to create a post'))
    }

    if (!(req?.body?.title) || !(req?.body?.content)) {
        next(errorHandler(400, 'Please provide all required fields'))
    }

    const slug = req?.body?.title?.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

    const newPost = new Post({
        ...req.body, userId: req.user.id, slug
    })

    try {
        const data = await newPost.save()
        res.status(201).json(data)
    } catch (error) {
        next(error)
    }
}

export const getPost = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex || 0)
        const limit = parseInt(req.query.limit || 9)
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const post = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    {
                        title: {
                            $regex: req.query.searchTerm, $options: 'i'
                        }
                    },
                    {
                        content: {
                            $regex: req.query.searchTerm, $options: 'i'
                        }
                    }
                ]
            })
        })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit)

        const totalPost = await Post.countDocuments()

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthPost = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            post,
            totalPost,
            lastMonthPost
        })
    } catch (error) {
        next(error)
    }
}

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || (req.params.userId !== req.user.id)) {
        next(errorHandler(401, 'You are not authorized to delete this post'))
    }

    try {
        await Post.findByIdAndDelete(req.params.postId)
        return res.status(200).json({ message: 'Post deleted successfully' })
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin || (req.params.userId !== req.user.id)) {
        return next(errorHandler(401, 'You are not authorized to update this post'))
    }

    try {
        const updatePost1 = await Post.findByIdAndUpdate(
            req.params.postId, 
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                }
            },
            {
                new: true
            }
        )
        res.status(200).json(updatePost1)
    } catch (error) {
        next(error)
    }
}