import { readAccessToken } from "../utils/auth.utils.js"

export function authenticate(req, res, next) {

    const accessToken = req.headers.authorization?.split(" ")[1]


    if (!accessToken) {
        return res.status(401).json({
            message: "Access Token is not found in request header"
        })
    }

    let decoded
    try {
        decoded = readAccessToken(accessToken)
    } catch {
        return res.status(401).json({
            message: "Invalid or Expired Access Token"
        })
    }

    req.user = decoded
    return next()
}

export function authenticateSeller(req, res, next) {
    if (req.user?.role !== "Seller") {
        return res.status(403).json({
            message: "User is not authorized to perform this action"
        })
    }

    return next()
}