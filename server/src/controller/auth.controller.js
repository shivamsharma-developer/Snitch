import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken, readRefreshToken } from "../utils/auth.utils.js";

/*
* description: Register a new user and save the data from req.body
* @param req Express request object 
* @param req.body = ({ email, name, password })
* @param req.body.email = string
* @param req.body.name = string
* @param req.body.password = string
*/

export async function register(req, res) {

    const { email, name, password } = req.body;

    const userAlreadyExists = await userModel.findOne({email})

    if (userAlreadyExists) {
        return res.status(400).json({
            message:" User with this email already exists",
            errors: [
                {
                    field: "email",
                    message: "User with this email already exists"
                }
            ]
        })
    }

    const user = await userModel.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password,12)
    })

    const AccessToken = createAccessToken({ userId: user._id, role: user.role })

    const RefreshToken = createRefreshToken({ userId: user._id, role: user.role })

    res.cookie("refreshToken", RefreshToken, {
        httpOnly: true,
    })

    await userModel.findByIdAndUpdate(user._id , {
        refreshToken: RefreshToken
    })

    return res.status(201).json({
        message: "User Registered Successfully",
        data: {
            user: {
                "email": user.email,
                "name": user.name,
                "role": user.role
            }
        }, accessToken: AccessToken
    })
}

/*
* description: login the exising user and give the set of new access and refresh token
* @param req Express request object 
* @param req.body = ({ email, password })
* @param req.body.email = string
* @param req.body.password = string
*/

export async function login(req, res) {
    
    const { email, password } = req.body

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const AccessToken = createAccessToken({userId: user._id, role: user.role})

    const RefreshToken = createRefreshToken({ userId: user._id, role: user.role})

    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: RefreshToken })

    res.cookie("refreshToken", RefreshToken,{
        httpOnly: true,
    })

    return res.status(200).json({
        message: "User Loggedin Successfully",
        data: {
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }, accessToken: AccessToken
        }
    })
}



/* 
* @description: Refresh the Refresh Token and Access Token
*/

export async function refresh(req, res) {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        
        return res.status(401).json({
            message: "Refresh Token is required"
        })
    }

    try {
        const decoded = readRefreshToken(refreshToken)

        const { userId, role } = decoded

        const user = await userModel.findById(userId)

        if (refreshToken != user.refreshToken) {
            await userModel.findByIdAndUpdate(user._id, {
                refreshToken: null
            })

            return res.status(401).json({
                message: "Refresh Token Mismatched",
            })
        }

        const AccessToken = createAccessToken({userId: user._id, role: user.role})

        const newRefreshToken = createRefreshToken({userId: user._id, role: user.role})

        await userModel.findByIdAndUpdate(user._id,{
            refreshToken: newRefreshToken
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true
        })

        res.status(200).json({
            message: "Token Rotated Successfully",
            data: {
                    user: {
                        email: user.email,
                        name: user.name,
                        id: user._id
                    },
                    accessToken: AccessToken
                }
        })

    } catch (err) {
        return res.status(401).json({
            message: "Invalid refresh Token"
        })
    }

}


export async function getme(req, res) {

    const {userId} = req.user

    const user = await userModel.findById(userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        message: "User Fetched Successfully",
        data: {
            user: {
                email: user.email,
                name: user.name,
                id: user._id
            }
        }
    })
}