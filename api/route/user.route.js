import express from "express";
import { deleteUser, logoutUser, test, updateUser, getUser, getUser1 } from "../controller/user.controller.js";
import { verifyUser } from "../util/verifyUser.js";

const router = express.Router();

router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)
router.delete('/delete/:userId', verifyUser, deleteUser)
router.post('/logout', logoutUser)
router.post('/getuser', verifyUser, getUser);
router.get('/:userId', getUser1)

export default router