import Comment from '../model/comment.model.js'
import { errorHandler } from '../util/error.js'

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId != req.user.id) {
            return next(errorHandler(403, 'You are nor allowed to create this comment'))
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })

        await newComment.save()

        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}

export const getPostComment = async (req, res, next) => {
    try {
        const allComment = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1
        })

        res.status(200).json(allComment)
    } catch (error) {
        next(error)
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)

        if (!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }

        const userIndex = comment?.like.indexOf(req.user.id)

        if (userIndex === -1) {
            comment.numberOfLike += 1
            comment.like.push(req.user.id)
        }
        else {
            comment.numberOfLike -= 1
            comment.like.splice(userIndex, 1)
        }

        await comment.save()
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        console.log(comment)

        if (!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }

        if (!req.user.isAdmin && (comment?.userId != req.user.id)) {
            return next(errorHandler(403, 'You are not allowed to edit this comment'))
        }

        const editComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                $set: {
                    content: req.body.content
                }
            },
            {
                new: true
            }
        )

        res.status(200).json(editComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)

        if (!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete this comment'))
        }

        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment deleted successfully')
    } catch (error) {
        next(error)
    }
}

export const getComment = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to view this comment'))
        }

        const startIndex = req.query.startIndex || 0
        const limit = req.query.limit || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const comment = await Comment.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit)

        const totalComment = await Comment.countDocuments()
        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthcomment = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({ comment, totalComment, lastMonthcomment })
    } catch (error) {
        next(error)
    }
}