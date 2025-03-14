import { errorHandler } from "../util/error.js"
import User from '../model/user.model.js'
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({
        "message": "Hello, World!"
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }

    if (req.body.password) {
        if (req.body.password < 8 ) {
            return next(errorHandler(400, 'Password must be at least 8 characters'))
        }
        req.body.password = await bcryptjs.hash(req.body.password, 10)
    }

    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }

        if ((typeof req?.body?.username === 'string') && req?.body?.username?.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }
    
        if (!req?.body?.username?.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'))
        }
    
        if (req?.body?.username !== req?.body?.username?.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'))
        }
    }

    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.userId, 
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password
                }
            },
            { new: true })
            const { password, ...rest} = updateUser._doc
            res
            .status(200)
            .json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req?.user?.isAdmin && req?.user?.id !== req?.params?.userId) {
        return next(errorHandler(403, 'You are not authorized to delete this user'))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted successfully')
    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res
        .clearCookie('access_token')
        .status(200)
        .json('User has been logged out successfully')
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to view all user'))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const user = await User.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit)

        const userWithoutPassword = user.map((user) => {
            const {password, ...rest} = user._doc
            return rest
        })

        const totalUser = await User.countDocuments()

        const now = new Date()

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthUser = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            user: userWithoutPassword,
            totalUser,
            lastMonthUser
        })
    } catch (error) {
        next(error)
    }
}

export const getUser1 = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)

        if (!user) {
            return next(errorHandler(404, 'User not found'))
        }

        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}