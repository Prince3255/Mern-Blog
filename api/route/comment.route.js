import express from 'express'
import { verifyUser } from '../util/verifyUser.js'
import { createComment, getPostComment, likeComment, editComment, deleteComment, getComment } from '../controller/comment.controller.js'

const router = express.Router()

router.post('/create', verifyUser, createComment)
router.get('/getcomment/:postId', getPostComment)
router.put('/likecomment/:commentId', verifyUser, likeComment)
router.put('/editcomment/:commentId', verifyUser, editComment)
router.delete('/deletecomment/:commentId', verifyUser, deleteComment)
router.get('/getcomment', verifyUser, getComment)

export default router