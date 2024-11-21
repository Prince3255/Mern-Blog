import express from 'express'
import { verifyUser } from '../util/verifyUser.js'
import { createPost, updatePost, getPost, deletePost } from '../controller/post.controller.js'

const router = express.Router()

router.post('/create', verifyUser, createPost)
router.post('/getpost', getPost)
router.delete('/deletepost/:postId/:userId', verifyUser, deletePost)
router.put('/updatepost/:postId/:userId', verifyUser, updatePost)

export default router