import User from "../model/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../util/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All field are required"))
    }

    const hashPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashPassword
    })

    try {     
        await newUser.save()
        res.json('signup successfull')
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All field are required'))
    }

    try {
        const user = await User.findOne({email})

        if (!user) {
            return next(errorHandler(404, "User or Password is incorrect"))
        }
        
        const validPassword = bcryptjs.compareSync(password, user.password)

        if (!validPassword) {
            return next(errorHandler(404, "User or Password is incorrect"))
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET_KEY
        )

        const { password: pass, ...rest } = user._doc

        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true
            })
            .json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body

    if (!name || !email ) {
        next(errorHandler(400, 'All field are required'))
    }

    try {
        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET_KEY
            )

            const { password: pass, ...rest } = user._doc

            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                })
                .json(rest)
        }
        else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

            const hashPassword = bcryptjs.hashSync(generatePassword, 10)

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashPassword,
                profilePicture: googlePhotoUrl
            })

            await newUser.save()
            const token = jwt.sign(
                {
                    id: newUser._id
                },
                process.env.JWT_SECRET_KEY
            )

            const { password: pass, ...rest } = newUser._doc

            res
                .status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                })
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}